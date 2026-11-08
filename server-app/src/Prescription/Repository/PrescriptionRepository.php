<?php

namespace App\Prescription\Repository;

use App\MedicalRecord\Entity\MedicalRecord;
use App\Prescription\Entity\Prescription;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PrescriptionRepository extends ServiceEntityRepository
{
 public function __construct(ManagerRegistry $registry)
 {
  parent::__construct($registry, Prescription::class);
 }

 public function findByMedicalRecord(MedicalRecord $medicalRecord): array
 {
  return $this->findBy(
   ['medicalRecord' => $medicalRecord],
   ['prescriptionDate' => 'DESC']
  );
 }
}
