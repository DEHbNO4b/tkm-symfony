<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity as E;
use Symfony\Component\Security\Core\Security;

class Tree extends AbstractController
{
    private Security $security;
    private TokenStorageInterface $tokenStorage;
    private SessionInterface $session;
    private EntityManagerInterface $entityManager;

    public function __construct(
        Security $security,
        TokenStorageInterface $tokenStorage,
        RequestStack $requestStack,
        EntityManagerInterface $entityManager
    ){
        // Avoid calling getUser() in the constructor: auth may not
        // be complete yet. Instead, store the entire Security object.
        $this->security = $security;
        $this->tokenStorage = $tokenStorage;
        $this->session = $requestStack->getSession();
        $this->entityManager = $entityManager;

    }


    #[Route('/getTrees', name: 'get_all_trees')]
    public function getAllTrees(EntityManagerInterface $entityManager)
    {
        $conn = $entityManager->getConnection();
        $sql = 'SELECT id, family FROM trees';
        $resultSet = $conn->fetchAllAssociative($sql);
        return new JsonResponse($resultSet);
    }

    #[Route('/searchQuery/{searchString}', name: 'searchQuery')]
    public function search($searchString, EntityManagerInterface $entityManager)
    {
        $words = explode('_', $searchString);
        //$conn = $this->getDoctrine()->getManager()->getConnection();
        $conn = $entityManager->getConnection();
        $resultSet = array();
        if(count($words) == 1){
            /*
                SELECT family, '' as name, nationality, count(nodes.id) AS ncount, trees.date_added as date FROM trees, nodes WHERE lower(family) = lower(:word) AND nodes.tree_id=trees.id UNION ALL SELECT family, name, nationality, (SELECT COUNT(id) FROM nodes WHERE tree_id=trees.id) as ncount, trees.date_added as date FROM trees, persons, nodes WHERE trees.id = nodes.tree_id AND nodes.person_id = persons.id AND lower(persons.name)=lower(:word)
            */
            $sql = "SELECT
                        trees.id as id, 
                        family, 
                        '' as name, 
                        nationality, 
                        count(nodes.id) AS ncount, 
                        trees.date_added as date,
                        '' as gender 
                    FROM 
                        trees, 
                        nodes 
                    WHERE 
                        lower(family) = lower(:word) AND 
                        nodes.tree_id=trees.id 
                    UNION ALL 
                    SELECT 
                        trees.id as id,
                        family, 
                        name, 
                        nationality, 
                        (SELECT COUNT(id) FROM nodes WHERE tree_id=trees.id) as ncount, 
                        nodes.date_added as date,
                        gender 
                    FROM 
                        trees, 
                        persons, 
                        nodes 
                    WHERE 
                        trees.id = nodes.tree_id AND 
                        (nodes.person_id = persons.id OR nodes.spouse_id = persons.id) AND 
                        lower(persons.name)=lower(:word)";
           // $satement = $conn->prepare($sql);
           // $satement->execute(["word"=>$words[0]]);
            $resultSet = $conn->fetchAllAssociative($sql, ["word"=>$words[0]]);
        }
        else if (count($words) == 2){
            $sql="SELECT
                    trees.id as id, 
                    family, 
                    name, 
                    nationality, 
                    nodes.date_added as date, 
                    (SELECT COUNT(id) FROM nodes WHERE tree_id=trees.id) as ncount,
                    gender 
                FROM 
                    trees, 
                    persons, 
                    nodes 
                WHERE 
                    trees.id = nodes.tree_id AND 
                    nodes.person_id = persons.id AND 
                    ((lower(family)=lower(:word_one) AND lower(persons.name)=lower(:word_two)) 
                    OR 
                    (lower(family)=lower(:word_two) AND lower(persons.name)=lower(:word_one)))";
            //$satement = $conn->prepare($sql);
            //$satement->execute(["word_one"=>$words[0], "word_two"=>$words[1]]);
            $resultSet = $conn->fetchAllAssociative($sql, ["word_one"=>$words[0], "word_two"=>$words[1]]);
        }
        if($resultSet[0]["id"]==null){
            array_splice($resultSet, 0, 1);
        }
        return new JsonResponse($resultSet);
    }

    #[Route('/getTree/{id}', name: 'get_tree_by_id')]
    public function getTreeById($id)
    {
        $resultSet = $this->entityManager->getRepository(E\Tree::class)
            ->find($id);

        if (!$resultSet) {
            throw $this->createNotFoundException(
                'No tree found for id '.$id
            );
        }

        $result['id'] = $id;
        $result['family'] = $resultSet->getFamily();
        $result['adminId'] = $resultSet->getAdminId();
        $result['dateAdded'] = $resultSet->getDateAdded();
        $result['lastUpdate'] = $resultSet->getLastUpdate();

        return new JsonResponse($result);
    }

    #[Route('/getTreeData/{id}', name: 'get_tree_data_by_id')]
    public function getTreeDataById($id, EntityManagerInterface $entityManager)
    {
        $conn = $entityManager->getConnection();
        $tree = $this->getTree($id, $conn);
        return new JsonResponse($tree);
    }

    #[Route('/userSubscribed/{id}', name: 'is_user_subscribed')]
    public function isUserSubscribed($id){
        
        $result = array();
        $result["subscribed"]= $this->checkSubscription($id);   
        return new JsonResponse($result);
    }


    private function checkSubscription($id, EntityManagerInterface $entityManager){
        $conn = $entityManager->getConnection();
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $sql = "SELECT 
                    id 
                FROM 
                    tree_subscription 
                WHERE 
                    user_id=".$user->getId()." AND
                    tree_id=:treeId
                ";
       // $stmt = $conn->prepare($sql);
       // $stmt->execute(['treeId' => $id]);
        $resultSet = $conn->fetchAllAssociative($sql, ['treeId' => $id]);
        if(count($resultSet) == 0){
            return false;
        }
        else{
            return true;
        }
    }

    #[Route('/subscribe/{id}', name: 'subscribe_tree')]
    public function subscribe($id){
        if(!$this->checkSubscription($id)){
            $user = $this->get('security.token_storage')->getToken()->getUser();
            $entityManager = $this->getDoctrine()->getManager();
            $tree = $entityManager->getRepository(E\Tree::class)->find($id);
            $subscribtion = new E\TreeSubscription;
            $subscribtion->setUserId($user->getId());
            $subscribtion->setTreeId($tree->getId());
            $entityManager->persist($subscribtion);
            $entityManager->flush();    
        }
        return new JsonResponse([]);
    }

    #[Route('/unsubscribe/{id}', name: 'unsubscribe_tree')]
    public function unsubscribe($id, EntityManagerInterface $entityManager){
        if($this->checkSubscription($id)){
            $user = $this->get('security.token_storage')->getToken()->getUser();
            //$entityManager = $this->getDoctrine()->getManager();
            $tree = $entityManager->getRepository(E\Tree::class)->find($id);

            $subscribtion = $entityManager->getRepository(E\TreeSubscription::class)->
                                                        findOneBy(array("user_id"=>$user->getId(),
                                                                        "tree_id"=>$tree->getId()));
            
            $entityManager->remove($subscribtion);
            $entityManager->flush();    
        }
        return new JsonResponse([]);
    }


    public function getTree($id, $connection){
        $conn = $connection;//

        $sql = '
            SELECT
                t.id,
                t.family,
                n.parent_id,
                n.person_id,
                n.spouse_id,
                n.user_id, 
                IFNULL(s.name, "") spouse_name,
                IFNULL(s.gender, "female") spouse_gender,
                p.name,
                p.gender,
                n.deleted
            FROM
                trees t
            INNER JOIN
                nodes n ON n.tree_id = t.id
            INNER JOIN
                persons p ON p.id = n.person_id
            LEFT JOIN
                persons s ON s.id = n.spouse_id
            WHERE
                t.id = :tree_id
            ORDER BY
                n.parent_id,
                p.id;
            ';


        $resultSet = $conn->fetchAllAssociative($sql, ['tree_id' => $id]);
        $tree = $this->buildFamilyTree($resultSet);
        return $tree;
    }

    protected function buildFamilyTree($data)
    {
        $result = [];

        if (!empty($data)) {
            $treeData = $this->makeTree(0, $data);

            if (!empty($treeData)) {
                $result = $treeData[0];
            }
        }

        return $result;
    }

    public function makeTree($parentId = 0, $treeData, & $result = [])
    {
        $array = $this->getChildren($parentId, $treeData);

        $i = 0;

        if ($array != false) {
            foreach ($array as $item) {
                $result[$i] = [
                    //'id' => $item['id'],
                    //'family' => $item['family'],
                    //'parent_id' => $item['parent_id'],
                    'person_id' => $item['person_id'],
                    'name' => $item['name'],
                    'user_id'=> ($item['user_id']?$item['user_id']:0),
                    'is_deleted'=>$item["deleted"]
                    //'gender' => $item['gender']
                ];

                $result[$i]['class'] = $item['gender'] === 'male' ? 'man' : 'woman';

                if ($parentId == 0) {
                    $result[$i]['textClass'] = 'emphasis';
                }

                $marriages = [];
                $spouseGender = ($item['spouse_id']==0)?(($item["gender"]=="female")?"male":"female"):$item["spouse_gender"];
                $spouse = [
                    'name' => ($item['spouse_id'] > 0 ? $item['spouse_name'] : 'Не указано'),
                    'class' => ($spouseGender === 'female' ? 'woman' : 'man'),
                    'id'=> ($item['spouse_id'] > 0 ? $item['spouse_id'] : '0')
                ];

                $marriages['spouse'] = $spouse;

                $children = $this->makeTree($item['person_id'], $treeData);

                if ($children != null) {
                    $marriages['children'] = $children;
                }

                if ($children != null || $item['spouse_id'] > 0) {
                    $result[$i]['marriages'] = [$marriages];
                }

                $i++;
            }
        }

        return $result;
    }

    #[Route('/getUserTrees', name: 'get_current_user_trees_count')]
    public function getCurrentUserTrees(EntityManagerInterface $entityManager, Security $sec)
    {
        $result["result"]="error";
        
        //$currentUser = $this->security->getUser();
        $currentUser = $sec->getUser();

        if(gettype($currentUser)!="object"){
            $result["error"]="No logined user";
            return new JsonResponse($result);

        }
        // лог юзера
       //  \App\Utils\Logger::log($currentUser, '_Tree->getCurrentUserTrees');


        $tree = $entityManager->getRepository(E\Tree::class)->findOneBy(array('adminId'=>$currentUser->getId()));

        $result["result"]="ok";
        $result["tree"] = ($tree != null)?$tree->getId():0;
        return new JsonResponse($result);
    }

    protected function getChildren($personId, $treeData)
    {
        $result = [];

        foreach ($treeData as $item) {
            if ($item['parent_id'] == $personId) {

                $result[] = [
                    //'id' => $item['id'],
                    //'family' => $item['family'],
                    'parent_id' => $item['parent_id'],
                    'person_id' => $item['person_id'],
                    'user_id' => $item['user_id'],
                    'spouse_id' => $item['spouse_id'],
                    'spouse_name' => $item['spouse_name'],
                    'spouse_gender' => $item['spouse_gender'],
                    'name' => $item['name'],
                    'gender' => $item['gender'],
                    'deleted'=>$item['deleted']
                ];
          }
        }

        if (count($result) > 0) {
          return $result;
        }

        return false;
    }


    #[Route('/showFamilyTree/{id}', name: 'show_tree_by_id')]
    public function showD3JsDTree($id)
    {
        $treeData = $this->getTreeDataById($id)->getContent();
        return $this->render('Default/d3JsDTree.html.twig', ['treeData' => $treeData, 'treeId' => $id]);
    }

    #[Route('/addTreeFormSave', name: 'new_tree_into_db')]
	public function saveNewTree(Request $request, EntityManagerInterface $entityManager){
		 $result['result'] = 'failed';
            $content = $request->getContent();
            $data = json_decode($content);
            $currentUser = $this->get('security.token_storage')->getToken()->getUser();
            if(gettype($currentUser)!="object"){
                $result["error"]="No logined user";
                return new JsonResponse($result);  
            } 
            // Проверка введённых данных
            $firstname = $data->firstname;
            $lastname = $data->lastname;
			$nationality = $data->nationality;

            if ($this->validateUserDataInput([
                'firstname' => $firstname,
                'lastname' => $lastname,
            ])) {
                //$entityManager = $this->getDoctrine()->getManager();

                $tree = new E\Tree;
                $tree->setAdminId($currentUser->getId());
                $tree->setFamily($lastname);
				if($nationality != null){
				$tree->setNationality($nationality);
				} else {
				$tree->setNationality('');	
				}
				$tree->setDateAdded( (new \DateTime) );
				
				$persons = new E\Person;
				$persons->setName($firstname);
                $persons->setGender('male');
                $persons->setPhoto("");
                $persons->setBirthDate((new \DateTime("0001-01-01 00:00:00")));
                $persons->setDeadDate((new \DateTime("0001-01-01 00:00:00")));
				$persons->setDateAdded( (new \DateTime) );
				
				$entityManager->persist($persons);
                $entityManager->persist($tree);
				$entityManager->flush();
				
				$node = new E\Node;
				$node->setTreeId($tree->getId());
				$node->setParentId(0);
				$node->setPersonId($persons->getId());
				$node->setSpouseId(0);
				$node->setDateAdded( (new \DateTime) );
                $node->setUserId($currentUser->getId());
                $node->setInviteHash("");
                $node->setDeleted(0);
				
				$entityManager->persist($node);
                $entityManager->flush();
				
				 $result['result'] = 'ok';
				 $result['id'] = $tree->getId();
            }
        
		
		return new JsonResponse($result);
	}
	
	protected function validateUserDataInput(array $data)
    {
        $userFields = [
            'firstname',
            'lastname'
        ];

        foreach ($userFields as $v) {
            $$v = isset($data[$v]) ? $data[$v] : null;
        }

        if (
            !$firstname
            ||
            !$lastname
        ) {
            return false;
        }

        return true;
    }

    public function dbgLog($data)
    {
        $res = fopen('/var/log/php/php_debug.log', 'a');
        fwrite($res, "=======================".date('d.m.Y H:i:s')."============================\n");
        fwrite($res, print_r($data, 1));
        fwrite($res, "\n");
        fclose($res);
    }


}