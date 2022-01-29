<?php
// src/Repository/UserRepository.php
namespace App\Repository;

use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\EntityRepository;
use App\Entity\Tree;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserRepository extends ServiceEntityRepository implements UserLoaderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tree::class);
    }


    public function loadUserByUsername($username)
    {
        return $this->createQueryBuilder('u')
            //->where('u.username = :username OR u.email = :email')
            ->where('u.firstname = :fname OR u.lastname = :lname')
            ->setParameter('fname', $username)
            ->setParameter('lname', $username)
            ->getQuery()
            ->getOneOrNullResult();
    }


    /**
     * @param string $identifier
     * @return UserInterface|null
     */
    public function loadUserByIdentifier(string $identifier): ?UserInterface
    {
        // TODO: Implement loadUserByIdentifier() method.
    }
}