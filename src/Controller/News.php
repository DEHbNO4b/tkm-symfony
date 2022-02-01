<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity as E;

class News extends AbstractController
{

    #[Route('/news/list/', name: 'news_get_list')]
	public function getList(EntityManagerInterface $entityManager){
		$conn = $entityManager->getConnection();
		$user = $this->getUser();//getUser();
		$userId = 0;
		if(gettype($user)=="object") $userId = $user->getId();
		$sql = "SELECT
					n.id, 
					n.user_id as userId,
					n.status,
					n.header, 
					n.text, 
					n.video, 
					
					n.last_update
				FROM 
					nodes as nd,
					news as n
				LEFT JOIN
					news_images as img
				ON
					n.id = img.news_id
				LEFT JOIN 
					tree_subscription as ts 
				ON 
					ts.tree_id=n.tree_id 
				WHERE
					n.status = 1
					AND
					nd.user_id=".$userId."
				OR 
					(n.status = 0 
					AND
					n.user_id = ".$userId."
					AND 
					nd.user_id=".$userId."
					AND
					".$userId." != 0)
				OR
					(n.tree_id = nd.tree_id 
					AND 
					nd.user_id =".$userId."
					AND
					".$userId." != 0)
				OR
					(
					ts.user_id=".$userId."
					AND
					".$userId." !=0
					AND
					ts.tree_id = n.tree_id
					AND
					n.status = 3
					)

				GROUP BY n.id
				ORDER BY last_update DESC";
	//	$statement = $conn->prepare($sql);
	//	$statement->execute();
		$resultSet = $conn->fetchAllAssociative($sql);
		return new JsonResponse($resultSet);
	}

    #[Route('/news/image/{path}', name: 'news_image')]
	public function getImage($path){
		if($path != "" && file_exists("user_files/news/".$path)){
    		$file = readfile("user_files/news/".$path);
    		$headers = array(
        		'Content-Type'=> 'image/png',
        		'Content-Disposition' => 'inline; filename="'.$path.'"');
    		return new Response($file, 200, $headers);
		}
		throw new NotFoundHttpException("Images doesn't exist");
	}


    #[Route('/news/info/{id}', name: 'get_news_info')]
	public function info($id,EntityManagerInterface $entityManager){
		$result["status"] = "error";
		$user = $this->getUser();//getUser();
		//$entityManager = $this->getDoctrine()->getManager();
		$news = $entityManager->getRepository(E\News::class)->find($id);
		if($user->getId() == $news->getUserId()){
			$result["id"] = $news->getId();
			$result["header"] = $news->getHeader();
			$result["text"] = $news->getText();
			$result["video"] = $news->getVideo();		
			$result["state"] = $news->getStatus();
			$image = $entityManager->getRepository(E\NewsImages::class)->findOneBy(array("news_id"=>$id));
			if($image){
				//$path = explode("/", $image->getPath());
				$result["image"] = $image->getPath();
			}	
			$result["status"] = "ok";	
		}
		return new JsonResponse($result);
	}


    #[Route('/news/save', name: 'news_save')]
	public function save(Request $request){

		//check if user logined
		$result["status"]="error";
		$user = $this->getUser();//getUser();
		if(gettype($user) != "object"){
			$result["error"] = "No user logined";
			return new JsonResponse($result);
		}
		//check if data exist 
		$data = $this->checkNewsInfo($request);
		if(!$data){
			$result["error"] = "No data";
			return new JsonResponse($result);
		}	

		//select if it is edit or add mode
		if($data["id"] && $data["id"] != 0){
			return $this->newsEdit($request);
		}
		return $this->newsAdd($request);
	}

    #[Route('/news/tree/list/{id}', name: 'get_tree_news_list')]
	public function getTreeNewsList($id, EntityManagerInterface $entityManager){
		$conn = $entityManager->getConnection();
		$user = $this->getUser();//getUser();
		$userId = 0;
		if(gettype($user)=="object") $userId = $user->getId();
		$sql = "SELECT
					n.id, 
					n.user_id as userId,
					n.status,
					n.header, 
					n.text, 
					n.video, 
					img.path as image,
					n.last_update
				FROM 
					nodes as nd,
					news as n
				LEFT JOIN
					news_images as img
				ON
					n.id = img.news_id
				WHERE
					n.tree_id = :tree_id
					AND
					(
						n.status = 0
						AND
						n.user_id = :user_id
						OR
						n.status = 2
						AND
						nd.tree_id = n.tree_id
						AND
						nd.user_id = :user_id
						AND
						:user_id != 0
						OR
						n.status = 3
					)

				GROUP BY n.id
				ORDER BY last_update DESC";

		//$statement = $conn->prepare($sql);
		//$statement->execute(['tree_id' => $id, "user_id"=>$userId]);
		$resultSet = $conn->fetchAllAssociative();
		return new JsonResponse($resultSet);
	}

	private function newsEdit(Request $request, EntityManagerInterface $entityManager){
		$result["status"] = "error";
		$user = $this->getUser();
		$role = ($this->get('security.token_storage')->getToken()->getRoles())[0]->getRole();
		$data = $this->checkNewsInfo($request);
		//$entityManager = $this->getDoctrine()->getManager();
		$tree = $entityManager->getRepository(E\Tree::class)->findOneBy(array("adminId"=>$user->getId()));
		$treeId = 0;
		$result["role"] = $role;
		if(($data["state"] == 1 && $role != "isRoot") || ($data["state"] > 1 && $role != "isUser")){
			$data["state"] = 0;
		}

		if($tree && $role == "isUser"){
			$treeId = $tree->getId();
		}

		$news = $entityManager->getRepository(E\News::class)->find($data["id"]);
		if($user->getId() != $news->getUserId()){
			$result["error"]="Presmission denied";
			return new JsonResponse($result);			
		}

		$news->setHeader($data["header"]);
		$news->setText($data["text"]);
		$news->setVideo($data["video"]);
		$news->setStatus($data["state"]);
		$news->setTreeId($treeId);
		$entityManager->persist($news);
		$entityManager->flush();
		if($request->files->get("image")){
			$file = $request->files->get("image");
			$curImage = $entityManager->getRepository(E\NewsImages::class)->findOneBy(array("news_id"=>$data["id"]));
			if((explode("/", $file->getMimeType()))[0] != "image"){
				$result["fileStatus"]="error";
				$result["fileError"]="wrong file type";
			}
			
			else{
				if(!is_dir("user_files/news")){
					mkdir("user_files/news");
				}
				try{
					$newFileName = time().".".$file->guessExtension();
					$file->move("user_files/news", $newFileName);

					if($curImage){
						if(file_exists($curImage->getPath()))
							unlink($curImage->getPath());
						$curImage->setPath("user_files/news/".$newFileName);
						$entityManager->persist($curImage);
						$entityManager->flush();
					}
					$newsImg = new E\NewsImages;
					$newsImg->setNewsId($news->getId());
					$newsImg->setPath($newFileName);	
					$entityManager->persist($newsImg);
					$entityManager->flush();

				}catch(FileException $e){
					$result["fileStatus"] = "error";
					$result["fileError"] = $e;
				}
				
			}
		}
		$result["status"]="ok";
		return new JsonResponse($result);
	}

	private function newsAdd(Request $request, EntityManagerInterface $entityManager){
		$user = $this->getUser();
		$role = ($this->get('security.token_storage')->getToken()->getRoles())[0]->getRole();
		$data = $this->checkNewsInfo($request);
		//$entityManager = $this->getDoctrine()->getManager();

		$tree = $entityManager->getRepository(E\Tree::class)->findOneBy(array("adminId"=>$user->getId()));
		$treeId = 0;
		if($tree && $role == "isUser"){
			$treeId = $tree->getId();
		}
		if(($data["state"] == 1 && $role != "isRoot") || ($data["state"] > 1 && $role != "isUser")){
			$data["state"] = 0;
		}
		$news = new E\News;
		$news->setHeader($data["header"]);
		$news->setText($data["text"]);
		$news->setVideo($data["video"]);
		$news->setStatus($data["state"]);
		$news->setDateAdded((new \DateTime));
		$news->setUserId($user->getId());
		$news->setTreeId($treeId);
		$entityManager->persist($news);
		$entityManager->flush();

		if($request->files->get("image")){
			$file = $request->files->get("image");
			if((explode("/", $file->getMimeType()))[0] != "image"){
				$result["fileStatus"]="error";
				$result["fileError"]="wrong file type";
			}
			else{
				if(!is_dir("user_files/news")){
					mkdir("user_files/news");
				}
				try{
					$newFileName = time().".".$file->guessExtension();
					$file->move("user_files/news", $newFileName);
					$newsImg = new E\NewsImages;
					$newsImg->setNewsId($news->getId());
					$newsImg->setPath($newFileName);	
					$entityManager->persist($newsImg);
					$entityManager->flush();
				}catch(FileException $e){
					$result["fileStatus"] = "error";
					$result["fileError"] = $e;
				}
				
			}
		}
		$result["status"]="ok";
		$result["newsId"] = $news->getId();
		return new JsonResponse($result);
	}



	private function checkNewsInfo(Request $data){
		$ret = array();
		$ret["id"] = $data->request->get("id");
		$ret["header"] = $data->request->get("header");
		$ret["text"] = $data->request->get("text");
		$ret["video"] = $data->request->get("video");
		$ret["state"] = $data->request->get("state");
		return $ret;
	}
}