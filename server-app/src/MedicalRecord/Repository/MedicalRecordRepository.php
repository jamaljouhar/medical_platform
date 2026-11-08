<?php

namespace App\MedicalRecord\Repository;

use App\MedicalRecord\Entity\MedicalRecord;
use App\Patient\Entity\Patient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class MedicalRecordRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MedicalRecord::class);
    }

    public function findByPatientOrderedByDate(
        Patient $patient
    ): array {
        return $this->createQueryBuilder('mr')
            ->andWhere('mr.patient = :patient')
            ->setParameter('patient', $patient)
            ->orderBy('mr.recordDate', 'DESC')
            ->addOrderBy('mr.id', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
