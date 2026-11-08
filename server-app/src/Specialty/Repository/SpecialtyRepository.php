<?php

namespace App\Specialty\Repository;

use App\Specialty\Entity\Specialty;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class SpecialtyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Specialty::class);
    }

    public function existsByName(string $name): bool
    {
        return $this->findOneBy([
            'name' => $name,
        ]) !== null;
    }
}