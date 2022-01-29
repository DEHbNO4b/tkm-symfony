<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'index')]

    #[Route('/signUp', name: 'react_user_reg_form')]
    #[Route('/signIn', name: 'react_user_login_form')]
    #[Route('/profile', name: 'react_user_profile')]
    #[Route('/showTree/{id}', name: 'react_showTree')]
    #[Route('/news/tree/{id}', name: 'get_tree_news')]
    #[Route('/notFound', name: 'react_not_found')]
    #[Route('/join/{hash}', name: 'join')]
    #[Route('/search/{searchQuery}', name: 'search')]
    #[Route('/aboutUs', name: 'aboutus')]
    #[Route('/news/add', name: 'news_add')]
    #[Route('/news/edit/{id}', name: 'news_edit')]
    #[Route('/home', name: 'show_form_add_tree')]
    public function index(): Response
    {
        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
        ]);

    }


}
