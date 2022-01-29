<?php

namespace App\Repository;

use App\Entity\TreeSubscription;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
//use Symfony\Bridge\Doctrine\RegistryInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TreeSubscription|null find($id, $lockMode = null, $lockVersion = null)
 * @method TreeSubscription|null findOneBy(array $criteria, array $orderBy = null)
 * @method TreeSubscription[]    findAll()
 * @method TreeSubscription[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TreeSubscriptionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TreeSubscription::class);
    }

//    /**
//     * @return TreeSubscription[] Returns an array of TreeSubscription objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?TreeSubscription
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
