<?php
// src/Controller/User.php
namespace App\Controller;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;



use App\Entity as E;

class User extends AbstractController
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
        $this->entityManager = $entityManager;
        $this->security = $security;
        $this->tokenStorage = $tokenStorage;
        $this->session = $requestStack->getSession();

    }

    #[Route('/getUser/{id}', name: 'get_user_by_id')]
    public function getUserById($id)
    {
        /*$resultSet = $this->getDoctrine()
            ->getRepository(E\User::class)
            ->find($id);*/
        $resultSet = $this->getUserById($id);

        if (!$resultSet) {
            throw $this->createNotFoundException(
                'No user found for id '.$id
            );
        }

        $result['id'] = $id;
        $result['firstname'] = $resultSet->getFirstname();
        $result['lastname'] = $resultSet->getLastname();
        $result['phone'] = $resultSet->getPhone();
        $result['email'] = $resultSet->getEmail();
        $result['passwordHash'] = $resultSet->getPassword();
        $result['salt'] = $resultSet->getSalt();
        $result['dateAdded'] = $resultSet->getDateAdded();
        $result['lastUpdate'] = $resultSet->getLastUpdate();

        return new JsonResponse([$result]);
    }



	public function passwordCorretById($id, $password_in)
    {
		$result['result'] = 'failed';

        /*$resultSet = $this->getDoctrine()
            ->getRepository(E\User::class)
            ->find($id);*/
        $resultSet = $this->getUserById($id);

        if (!$resultSet) {
            throw $this->createNotFoundException(
                'No user found for id '.$id
            );
        }

        $passwordHash = $resultSet->getPassword();
        $salt= $resultSet->getSalt();

		if($this->createPasswordHash($password_in, $salt) == $passwordHash){$result['result'] = 'ok';}

        return new JsonResponse($result);
    }

	protected function createPasswordHash($plainPassword, $salt)
    {
        $hash = sha1($plainPassword|$salt);
        $first4chars = substr($hash, 0, 4);
        $last6chars = substr($hash, -6, 6);

        return $last6chars.substr($hash, 4, strlen($hash)-10).$first4chars;
    }

    #[Route('/getCurrentUser', name: 'get_current_user')]
    public function getCurrentUser(
        EntityManagerInterface $entityManager)
    {
        $currentUser = $this->getUser();
        $result = [];
         // \App\Utils\Logger::log($this->tokenStorage->getToken(), '_User_getCurrentuser_token');
        //$currentUser = $this->tokenStorage->getToken()->getUser();
        //$currentUser = $user;
        // \App\Utils\Logger::log($currentUser, '_User_getCurrentuser_');


        if(gettype($currentUser)!="object") return new JsonResponse(array());
        $userData= $entityManager->getRepository(E\User::class)->find($currentUser->getId());
        if($userData) {
            $result['firstname'] = $userData->getFirstName();
            $result['lastname'] = $userData->getLastname();
            $result['mobileNumber'] = $userData->getPhone();
            $result['email'] = $userData->getEmail();
            $result['userId'] = $userData->getId();
            $result['role'] = ($this->get('security.token_storage')->getToken()->getRoles())[0]->getRole();
        }
        return new JsonResponse($result);
    }


    #[Route('/login', name: 'user_sign_in')]
    public function login(Request $request,
                          ManagerRegistry $doctrine,
                          UserPasswordHasherInterface $passwordHasher,
                          AuthenticationUtils $authenticationUtils)
    {
        $result['result'] = 'error';
        $error = $authenticationUtils->getLastAuthenticationError();
        \App\Utils\Logger::log($error, '_User_login-error_');

        if ('POST' === $request->getMethod()) {
            $content = $request->getContent();
            $data = json_decode($content);

            if($this->checkUserLoginData($data)){
                $res = $this->loginUser($request, $doctrine, $passwordHasher,  $data->phone, $data->password);
                $result["result"] = $res;
            }
        }
       // $tt = $this->getCurrentUser($this->entityManager);
        return new JsonResponse($result);
    }

    private function loginUser(
        Request $request, 
        ManagerRegistry $doctrine,
        UserPasswordHasherInterface $passwordHasher,
        $phone, 
        $password
    ){
        $result="error";
       // $user = $entityManager->getRepository(E\User::class)->findOneBy(array("phone"=>$phone));
        $entityManager=$doctrine->getManager();

       // $user = $this->findOneBy(array("phone"=>$phone));
		$qb = $entityManager->createQueryBuilder();
		$qb
        ->select('u', 'r')
        ->from('App\Entity\User', 'u')
        ->Join(
            'App\Entity\UserRoles',
            'r',
            \Doctrine\ORM\Query\Expr\Join::WITH,
            'r.user_id = u.id'
        )
        ->where('u.phone = '.$phone)
        ->orderBy('u.firstname', 'DESC');

		$user = $qb->getQuery()->getResult();


        if(!$user){
            return $result;
        }

        if(!$passwordHasher->isPasswordValid($user[0], $password)){
            /*\App\Utils\Logger::log(__file__.': '.__line__, '_login_user');
            \App\Utils\Logger::log($user, '_login_user');
            \App\Utils\Logger::log($password, '_login_user');*/
            return $result;

        }
        

		$role = 'isUser';
		if($user[1]->getRoleId() == 2){
		  $role = 'isRoot';
		}else if($user[1]->getRoleId() == 3){
          $role = "tree_user";
        }

        $token = new UsernamePasswordToken($user[0], 'main', array($role));

        //    \App\Utils\Logger::log($token, '_login_user');

        /*$this->get('security.token_storage')->setToken($token);
        $this->get('session')->set('_security_main', serialize($token));
        $event = new InteractiveLoginEvent($request, $token);
        $this->get("event_dispatcher")->dispatch("security.interactive_login", $event);
        */

        $this->tokenStorage->setToken($token);
        //$this->session->set('_security_main', serialize($token));
        $request->getSession()->set('_security_main', serialize($token));
        $event = new InteractiveLoginEvent($request, $token);


        $result = "ok";

        return $result;
    }

    private function getNode($hash, ManagerRegistry $doctrine){
        $entityManager=$doctrine->getManager();
        return $entityManager->getRepository(E\Node::class)->findOneBy(array("invite_hash"=>$hash, "user_id"=>0));
    }


    #[Route('/addUserIntoDb', name: 'add_user_into_db')]
    public function addUserIntoDb(Request $request, ManagerRegistry $doctrine,UserPasswordHasherInterface $passwordHasher)
    {
        $result['result'] = 'failed';

        if ('POST' === $request->getMethod()) {
            $content = $request->getContent();
            $data = json_decode($content);

           //  \App\Utils\Logger::log($data, '_add_user');
            //  \App\Utils\Logger::log($doctrine->getManager(), '_add_user');

            // Проверка введённых данных
            $firstname = $data->firstname;
            $lastname = $data->lastname;
            $mobileNumber = $data->mobileNumber;
            $email = $data->email;
            $password = $data->password;
            $hash = "";
            $node = null;
            if($data->hash){
                $node = $this->getNode($data->hash, $doctrine);
                if($data->hash != "" &&  $node == null){
                    return new JsonResponse($result);
                }
                $hash = $data->hash;
            }

            if ($this->validateRegUserData([
                'firstname' => $firstname,
                'lastname' => $lastname,
                'mobileNumber' => $mobileNumber,
                'email' => $email,
                'password' => $password
            ])) {

                $entityManager = $doctrine->getManager();
                $user = new E\User;
                $hashedPassword = $passwordHasher->hashPassword(
                    $user,
                    $password
                );

                $user->setFirstname($firstname);
                $user->setLastname($lastname);
                $user->setPhone($mobileNumber);
                $user->setEmail($email);
                $user->setPassword($hashedPassword);
                $user->setDateAdded( (new \DateTime) );
                $user->setLastUpdate( (new \DateTime) );




				$entityManager->persist($user);
                $entityManager->flush();
                \App\Utils\Logger::log(__file__.': '.__line__, '_add_user');
                \App\Utils\Logger::log($user, '_add_user');
                $result['firstname'] = $firstname;
                $result['lastname'] = $lastname;
                $result['mobileNumber'] = $mobileNumber;
                $result['email'] = $email;
                $result['userId'] = $user->getId();

				$role = new E\UserRoles;
				$role->setUserId($user->getId());
                if($hash != ""){
                    $role->setRoleId(3);
                }else{
                    $role->setRoleId(1);
                }

				$entityManager->persist($role);
				$entityManager->flush();
                if($hash != ""){
                    $node = $entityManager->getRepository(E\Node::class)->findOneBy(array("invite_hash"=>$hash));
                    if($node){
                        $node->setUserId($user->getId());
                        $entityManager->persist($node);
                        $entityManager->flush();
                    }
                }

                $result['result'] = 'ok';
               // $this->loginUser($request, $doctrine, $passwordHasher, $mobileNumber, $password);
            }
        }

        return new JsonResponse($result);
    }
//кажется эта ф-я не работает
    protected function validateRegUserData(array $data)
    {
        $userFields = [
            'firstname',
            'lastname',
            'mobileNumber',
            'email',
            'password'
        ];

        foreach ($userFields as $v) {
            $$v = isset($data[$v]) ? $data[$v] : null;
        }

		if(
		   strlen($password) < E\User::PASSWORD_MIN_LENGTH
		   ||
		   $password == ''
		   ||
		   !preg_match('/^[0-9,a-z,A-Z]+$/',$password)
		){
			$password = null;
		}

		if(
		   strlen($firstname) < E\User::NAMES_MIN_LENGTH
		   ||
		   $firstname == ''
		   ||
		   !preg_match('/^\S+$/',$firstname)
		){
			$firstname = null;
		}

		if(
		   strlen($lastname) < E\User::NAMES_MIN_LENGTH
		   ||
		   $lastname == ''
		   ||
		   !preg_match('/^\S+$/',$lastname)
		){
			$lastname = null;
		}

		if(
		   $mobileNumber == ''
		   ||
		   !preg_match('/^[0-9]{11}$/',$mobileNumber)
		){
			$mobileNumber = null;
		}


		if(
			strlen($email) < 1
		){
			$email = ' ';
		} else if(
		   !preg_match('/^[a-z,A-Z,0-9,_,-,.]*[a-z,A-Z,0-9,-]+@[a-z,A-Z,0-9,_,-,.]+[.]+[a-z,A-Z]{2,}$/',$email)
		){
			$email = null;
		}

        if (
            !$firstname
            ||
            !$lastname
            ||
            !$mobileNumber
            ||
            !$email
            ||
            !$password
        ) {
            return false;
        }

        return true;
    }

    protected function checkUserLoginData($data)
    {
        if(! isset($data->phone) || !isset($data->password)){
            return false;
        }
        if(!$data->phone || !$data->password){
            return false;
        }
        if(!preg_match('/^[0-9]{11}$/',$data->phone)){
            return false;
        }
        return true;
    }
}
