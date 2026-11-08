<?php

namespace App\Appointment\Repository;

use App\Appointment\Entity\Appointment;
use App\Patient\Entity\Patient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class AppointmentRepository extends ServiceEntityRepository
{
    
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Appointment::class);
    }

    public function findByPatient(Patient $patient): array
{
    return $this->findBy(
        ['patient' => $patient],
        ['appointmentDate' => 'DESC']
    );
}

}
