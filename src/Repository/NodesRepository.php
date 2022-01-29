<?php

namespace App\Repository;

use App\Entity\Nodes;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
//use Symfony\Bridge\Doctrine\RegistryInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Nodes|null find($id, $lockMode = null, $lockVersion = null)
 * @method Nodes|null findOneBy(array $criteria, array $orderBy = null)
 * @method Nodes[]    findAll()
 * @method Nodes[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NodesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Nodes::class);
    }

//    /**
//     * @return Nodes[] Returns an array of Nodes objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('n.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Nodes
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
