<?php
namespace App\Appointment\Entity;

use App\Appointment\Enum\AppointmentStatus;
use App\Appointment\Repository\AppointmentRepository;
use App\Doctor\Entity\Doctor;
use App\Patient\Entity\Patient;
use App\Shared\Entity\BaseEntity;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AppointmentRepository::class)]
class Appointment extends BaseEntity
{
    #[ORM\Column]
    private ?DateTimeImmutable $appointmentDate = null;

    #[ORM\Column(type: 'text')]
    private ?string $reason = null;

    #[ORM\Column(type: 'string', length: 30, enumType: AppointmentStatus::class)]
    private AppointmentStatus $status = AppointmentStatus::PENDING;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Patient $patient = null;

    #[ORM\ManyToOne(targetEntity: Doctor::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Doctor $doctor = null;

    public function getAppointmentDate(): ?DateTimeImmutable
    {
        return $this->appointmentDate;
    }

    public function setAppointmentDate(
        ?DateTimeImmutable $appointmentDate
    ): static {
        $this->appointmentDate = $appointmentDate;
        return $this;
    }

    public function getReason(): ?string
    {
        return $this->reason;
    }

    public function setReason(?string $reason): static
    {
        $this->reason = $reason;
        return $this;
    }

    public function getStatus(): AppointmentStatus
    {
        return $this->status;
    }

    public function setStatus(AppointmentStatus $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(Patient $patient): static
    {
        $this->patient = $patient;
        return $this;
    }

    public function getDoctor(): ?Doctor
    {
        return $this->doctor;
    }

    public function setDoctor(Doctor $doctor): static
    {
        $this->doctor = $doctor;
        return $this;
    }
}
