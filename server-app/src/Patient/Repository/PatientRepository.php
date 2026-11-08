<?php

namespace App\Patient\Repository;

use App\Patient\Entity\Patient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PatientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Patient::class);
    }

    public function findByUserAccountId(int $userAccountId): ?Patient
    {
        return $this->findOneBy([
            'userAccount' => $userAccountId,
        ]);
    }
}