<?php
// src/Controller/User.php
namespace App\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity as E;

class Node extends AbstractController
{
	
	private $roles = array("father", "mother", "brother", "sister", "husband", 
		"wife", "son", "daughter");
	private $maleRoles = array("father", "brother", "husband", "son");
	private $femaleRoles = array("mother", "sister", "wife", "daughter");


    #[Route('/getPersonInfo/{id}', name: 'get_person_info')]
	public function getPersonInfo($id){
		$result["status"] = "error";
		$entityManager = $this->getDoctrine()->getManager();
		$person = $entityManager->getRepository(E\Person::class)->find($id);
		if($person != null){
			$node = $entityManager->getRepository(E\Node::class)->findOneBy(array("person_id"=>$id));
			if($node == null){
				$node = $entityManager->getRepository(E\Node::class)->findOneBy(array("spouse_id"=>$id));
			}
			$tree = $entityManager->getRepository(E\Tree::class)->find($node->getTreeId());
			$lastname  = $tree->getFamily();
			$whenA = "бвгджзклмнпрстфхцчшщ";
			if(stripos($whenA, substr(strtolower($lastname), -1)) && $person->getGender() == "female"){
				$lastname .= 'а';
			}
			$result["status"] = "ok";
			$result["name"] = $person->getName();
			$result["lastname"] = $lastname;
			$result["birthDate"] = $person->getBirthDate()->format("d.m.Y");
			$result["deadDate"] = $person->getDeadDate()->format("d.m.Y");
			$photo = $person->getPhoto();
			if($photo != "" && file_exists("user_files/person_photos/".$photo)){
				$result["photo"] = $photo;
			}
		}
		return new JsonResponse($result);
	}

    #[Route('/deleteRestoreNode/{personId}', name: 'delete_node')]
	public function deleteRestoreNode($personId){
		$result["done"] = "error";
		$entityManager = $this->getDoctrine()->getManager();
		$node = $entityManager->getRepository(E\Node::class)->findOneBy(array("person_id"=>$personId));
		if($node){
			$deleted = $node->getDeleted();
			$node->setDeleted(($deleted == 1)?0:1);
			$entityManager->persist($node);
			$entityManager->flush();	
			$result["done"] = "ok";
		}
		return new JsonResponse($result);
	}

	private function persnoInfoToArray(Request $request){
		$data = array();
		$data["name"] = $request->request->get("name");
		$data["personId"] = $request->request->get("personId");
		$data["lastname"] = $request->request->get("lastname");
		$data["birthDate"] = $request->request->get("birthDate");
		$data["deadDate"] = $request->request->get("deadDate");
		$data["isSpouse"] = $request->request->get("isSpouse");
		$data["role"] = $request->request->get("role");
		return $data;
	}

    #[Route('/getPersonPhoto/{photo}', name: 'get_person_photo')]
	public function getPersonPhoto($photo){

		if($photo != "" && file_exists("user_files/person_photos/".$photo)){
    		$file = readfile("user_files/person_photos/".$photo);

    		$headers = array(
        		'Content-Type'=> 'image/png',
        		'Content-Disposition' => 'inline; filename="'.$photo.'"');
    		return new Response($file, 200, $headers);
		}
		throw new NotFoundHttpException("Photo doesn't exist");
		
	}

    #[Route('/editPerson', name: 'edit_person_info')]
	public function editPersonInfo(Request $request){
		$result["status"] = "error";
		$data = $this->persnoInfoToArray($request);
		if($data && $data["name"] != null && strlen($data["name"])>=2 &&
			$data["personId"] != 0){
			$entityManager = $this->getDoctrine()->getManager();
			$person = $entityManager->getRepository(E\Person::class)->findOneBy(array("id"=>$data["personId"]));
			$id=0;
			if($data["isSpouse"]){
				$id = $this->createPerson($data["name"], $data["role"]);
				$node = $this->getCurrentNode($data["personId"]);
				$node->setSpouseId($id);
				$entityManager->persist($node);
				$entityManager->flush();	
				$person = $entityManager->getRepository(E\Person::class)->findOneBy(array("id"=>$id));
			}
			
			if($person){
				$person->setName($data["name"]);
				if(preg_match("/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/", $data["birthDate"]))
					$person->setBirthDate(new \DateTime($data["birthDate"]));
				if(preg_match("/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/", $data["deadDate"]))
					$person->setDeadDate(new \DateTime($data["deadDate"]));
				$entityManager->persist($person);
				$entityManager->flush();
				$result["status"] = "ok";
				$result["name"] = $person->getName();
				if($request->files->get("image")){
					$file = $request->files->get("image");
					if((explode("/", $file->getMimeType()))[0] == "image"){
						try{
							if($person->getPhoto() != "" && file_exists("user_files/person_photos/".$person->getPhoto())){
								unlink("user_files/person_photos/".$person->getPhoto());
							}
							$newFileName = $data["personId"].".".$file->guessExtension();
							$file->move("user_files/person_photos", $newFileName);
							$person->setPhoto($newFileName);
							$entityManager->persist($person);
							$entityManager->flush();
						}catch(FileException $e){
							$result["fileStatus"] =	"error";
							$result["trace"] = $e;
						}
					}
				}
			}
		}
		return new JsonResponse($result);
	}

    #[Route('/getPersonByHash/{hash}', name: 'get_person_by_hash')]
	public function getPersonByHash(EntityManager $entityManager, $hash)
	{
		$result["status"]="error";
		$node = $entityManager->getRepository(E\Node::class)->findOneBy(array("invite_hash"=>$hash, "user_id"=>0));
		if($node){
			$person = $entityManager->getRepository(E\Person::class)->find($node->getPersonId());
			$tree = $entityManager->getRepository(E\Tree::class)->find($node->getTreeId());
			$lastname  = $tree->getFamily();
			$whenA = "бвгджзклмнпрстфхцчшщ";
			if(stripos($whenA, substr(strtolower($lastname), -1)) && $person->getGender() == "female"){
				$lastname .= 'а';
			}
			$result["name"] = $person->getName();
			$result["lastname"] = $lastname;
			$result["status"] = "ok";	
		}
		return new JsonResponse($result);
	}

    #[Route('/editPersonName', name: 'edit_person_name')]
	public function editName(Request $request){
		$result["status"] = "error";
		$data = json_decode($request->getContent());
		if($data && $data->name != null && strlen($data->name)>=2 &&
			$data->personId != 0){
			$entityManager = $this->getDoctrine()->getManager();
			$person = $entityManager->getRepository(E\Person::class)->findOneBy(array("id"=>$data->personId));
			if($person){
				$person->setName($data->name);
				$entityManager->persist($person);
				$entityManager->flush();
				$result["name"] = $data->name;
				$result["status"] = "ok";
			}
		}
		return new JsonResponse($result);
	}


    #[Route('/getInviteLink/{id}', name: 'get_invite_link')]
	public function getInviteLink($id)
	{
		$result["status"]="error";
		$url = (isset($_SERVER["HTTPS"]))?"https://":"http://";
		$url.=$_SERVER["SERVER_NAME"]."/join/";
		$entityManager = $this->getDoctrine()->getManager();
		$node = $entityManager->getRepository(E\Node::class)->findOneBy(array("person_id"=>$id));
		if($node->getUserId()!=0){
			$result["error"]="registered";
		}
		else if($node->getInviteHash() != ""){
			$result["status"]="ok";
			$result["link"]=$url.$node->getInviteHash();
		}
		else{
			$hash = sha1($node->getId());
			$hash = substr($hash, 0, 24);
			$node->setInviteHash($hash);
			$entityManager->persist($node);
			$entityManager->flush();
			$result["status"]="ok";
			$result["link"]=$url.$hash;	
		}
		return new JsonResponse($result);
	}


    #[Route('/addNodeIntoDb', name: 'add_node_into_db')]
	public function addNodeIntoDb(Request $request)
	{
		$result['result'] = 'error';
		if('POST' === $request->getMethod()){
			$content = $request->getContent();
			$data = json_decode($content);
			if($this->checkInsertedData($data) && $this->isNodeAccessable($data->treeId, $data->personId)){
				switch($data->role){
				case "father": $this->addParent($data); break;//$this->addFather($data); break;
				case "mother": $this->addParent($data); break;
				case "brother": $this->addBrotherOrSister($data); break;
				case "sister": $this->addBrotherOrSister($data); break;
				case "husband": $this->addSpouse($data); break;
				case "wife": $this->addSpouse($data); break;
				case "son": $this->addChild($data); break;
				case "daughter": $this->addChild($data); break;
				}
				$result["result"] = "ok";
			}
		}
		return new JsonResponse($result);
	}

	private function isNodeAccessable($treeId, $personId){
		$entityManager = $this->getDoctrine()->getManager();
		$treeController = new Tree();
		$tree = $treeController->getTree($treeId, $entityManager->getConnection());
		$treeMeta = $entityManager->getRepository(E\Tree::class)->findOneBy(array("id"=>$treeId));
		$user = $this->get('security.token_storage')->getToken()->getUser();
		if($treeMeta->getAdminId() == $user->getId()){
			return true;
		}
		else if(in_array($personId, $this->findEditableIds($tree, $user->getId()))){
			return true;
		}
    	return false;
	}

	private function findEditableIds($nd, $id){
        
        if($nd["user_id"] == $id){
        	$ret = $this->childIds($nd);
        	$ret[] = $nd["person_id"];
            return $ret;
        }
        else if(isset($nd["marriages"]) && count($nd["marriages"]) !=0){
            if(isset($nd["marriages"][0]["children"]) && count($nd["marriages"][0]["children"]) !=0){
                for($i=0; $i<count($nd["marriages"][0]["children"]); $i++){
                    $res = $this->findEditableIds($nd["marriages"][0]["children"][$i], $id);
                    if(count($res) != 0){
                        $res[]=$nd["person_id"];
                        return $res;
                    }
                }
            }
        }
        return array();
    }

    private function childIds($nd){
    	$ret = array();
    	if(isset($nd["marriages"]) && count($nd["marriages"]) !=0){
    		if(isset($nd["marriages"][0]["children"]) && count($nd["marriages"][0]["children"]) !=0){
    			for($i=0; $i<count($nd["marriages"][0]["children"]); $i++){
                    $ret[] = $nd["marriages"][0]["children"][$i]["person_id"];
                    $ret = array_merge($ret, $this->childIds($nd["marriages"][0]["children"][$i]));
                }	
    		}
    	}
    	return $ret;
    }
	
	private function addChild($data)
	{
		$entityManager = $this->getDoctrine()->getManager();
		$currentNode = $this->getCurrentNode($data->personId);
		if($currentNode->getSpouseId() == 0){
			$person = $entityManager->getRepository(E\Person::class)->find($data->personId);
			$spouseData = clone $data;
			$spouseData->role = ($person->getGender()=="male")?"wife":"husband";
			$spouseData->name="Не указано";
			$this->addSpouse($spouseData);
		}
		// Creating user in DB
		$newPersonId = $this->createPerson($data->name, $data->role);
		//Creating node in DB
		$node = new E\Node;
		$node->setTreeId($data->treeId);
		$node->setParentId($currentNode->getPersonId());
		$node->setPersonId($newPersonId);
		$node->setSpouseId(0);
		$node->setInviteHash("");
		$node->setUserId(0);
		$node->setDeleted(0);
		$node->setDateAdded((new \DateTime));
		$entityManager->persist($node);
		$entityManager->flush();
	}

	private function addBrotherOrSister($data)
	{
		$entityManager = $this->getDoctrine()->getManager();
		$personNode = $this->getCurrentNode($data->personId);
		if($personNode->getParentId() == 0){
			$fatherData = clone $data;
			$fatherData->name = "Не указано";
			$this->addFather($fatherData);
			$personNode = $entityManager->getRepository(E\Node::class)->findOneBy(array("person_id"=>$data->personId));
		}
		$newPersonId = $this->createPerson($data->name, $data->role);
		$node = new E\Node;
		$node->setTreeId($data->treeId);
		$node->setParentId($personNode->getParentId());
		$node->setPersonId($newPersonId);
		$node->setSpouseId(0);
		$node->setInviteHash("");
		$node->setUserId(0);
		$node->setDeleted(0);
		$node->setDateAdded((new \DateTime));
		$entityManager->persist($node);
		$entityManager->flush();

	}

	private function addFather($data)
	{
		$entityManager = $this->getDoctrine()->getManager();
		$node = $this->getCurrentNode($data->personId);
		if($node->getParentId() == 0){
			$fatherId = $this->createPerson($data->name, "father");
			$node->setParentId($fatherId);
			$entityManager->merge($node);
			$fatherNode = new E\Node;
			$fatherNode->setTreeId($data->treeId);
			$fatherNode->setParentId(0);
			$fatherNode->setPersonId($fatherId);
			$fatherNode->setSpouseId(0);
			$fatherNode->setInviteHash("");
			$fatherNode->setUserId(0);
			$fatherNode->setDeleted(0);
			$fatherNode->setDateAdded((new \DateTime));
			$entityManager->persist($fatherNode);
		}
		$entityManager->flush();

	}

	private function addMother($data)
	{
		$entityManager = $this->getDoctrine()->getManager();
		$node = $this->getCurrentNode($data->personId);
		if($node->getParentId() == 0){
			$fatherData = clone $data;
			$fatherData->name = "Не указано";
			$this->addFather($fatherData);
			$node = $this->getCurrentNode($data->personId);
		}
		$fatherNode = $entityManager->getRepository(E\Node::class)->findOneBy(array("person_id"=>$node->getParentId()));
		$motherPerson = $this->createPerson($data->name, $data->role);
		$fatherNode->setSpouseId($motherPerson);
		$entityManager->merge($fatherNode);
		$entityManager->flush();	
		
	}

	private function addParent($data)
	{
		$entityManager = $this->getDoctrine()->getManager();
		$node = $this->getCurrentNode($data->personId);
		if($node->getParentId()!=0){
			$parent = $entityManager->getRepository(E\Person::class)->find($node->getParentId());
			//if($parent->getSpouseId() == 0){
				$parentSpouseData = clone $data;
				$parentSpouseData->personId = $node->getParentId();
				$parentSpouseData->role = ($data->role == "mother")?"wife":"husband";
				$this->addSpouse($parentSpouseData);	
		/*	}
			else{
				$spouse = $entityManager->getRepository(E\Person::class)->find($parent->getSpouseId());
				if($spouse->getName() == "Не указано"){
					$spouse->setName($data->name);
					$entityManager->merge($spouse);
					$entityManager->flush();
				}
			}*/
		}
		else{
			if($data->role=="mother") $this->addMother($data);
			else $this->addFather($data);
		}
	}


	private function getCurrentNode($id)
	{
		$entityManager = $this->getDoctrine()->getManager();
		$node = $entityManager->getRepository(E\Node::class)->findOneBy(array("person_id"=>$id));
		if(!$node)
			$node = $entityManager->getRepository(E\Node::class)->findOneBy(array("spouse_id"=>$id));
		return $node;
	}


	private function addSpouse($data)
	{
		$entityManager = $this->getDoctrine()->getManager();
		$node = $this->getCurrentNode($data->personId);
		$person = $entityManager->getRepository(E\Person::class)->find($data->personId);
		if($node->getSpouseId() == 0){
			if(($person->getGender() == "female" && $data->role=="husband") 
				|| 
				($person->getGender() == "male" && $data->role=="wife")){
				
				$spouseId = $this->createPerson($data->name, $data->role);
				$node->setSpouseId($spouseId);
				$entityManager->merge($node);	
				$entityManager->flush();
			}	
		}
		else{
			$spouse = $entityManager->getRepository(E\Person::class)->find($node->getSpouseId());
			if($spouse->getName() == "Не указано"){
				$spouse->setName($data->name);
				$entityManager->merge($spouse);
				$entityManager->flush();
			}
		}
		
	}
	
	private function createPerson($name, $role)
	{
	    $entityManager = $this->getDoctrine()->getManager();
	    // Creating user in DB
	    $person = new E\Person;
	    $person->setName($name);
	    $person->setGender((in_array($role, $this->maleRoles))?"male":"female");
	    $person->setPhoto("");
	    $person->setBirthDate((new \DateTime("0001-01-01 00:00:00")));
	    $person->setDeadDate((new \DateTime("0001-01-01 00:00:00")));
	    $person->setDateAdded((new \DateTime));
	    
	    $entityManager->persist($person);
	    $entityManager->flush();
	    
	    return $person->getId();
	}
	
	private function checkInsertedData($data)
	{
		if(!isset($data->personId) ||!isset($data->role)||!isset($data->name)||!isset($data->treeId)){
		    return false;
		}
		$personId = $data->personId;
		$role = $data->role;
		$name = $data->name;
		$treeId = $data->treeId;
		if(!$personId || !$role || !$name || !$treeId){
			return false;
		}

		if($this->getCurrentNode($personId) == null){
			return false;
		}
		if(!in_array($role, $this->roles)){
			return false;
		}
		return true;
	}
}