<?php

namespace App\Prescription\Entity;

use App\Shared\Entity\BaseEntity;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'prescription_medications')]
class PrescriptionMedication extends BaseEntity
{
    #[ORM\ManyToOne(targetEntity: Prescription::class, inversedBy: 'medications')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Prescription $prescription = null;

    #[ORM\Column(length: 150)]
    private ?string $medicationName = null;

    #[ORM\Column(length: 100)]
    private ?string $dosage = null;

    #[ORM\Column(length: 100)]
    private ?string $frequency = null;

    #[ORM\Column(length: 100)]
    private ?string $duration = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $instructions = null;

    public function getPrescription(): ?Prescription
    {
        return $this->prescription;
    }

    public function setPrescription(?Prescription $prescription): static
    {
        $this->prescription = $prescription;
        return $this;
    }

    public function getMedicationName(): ?string
    {
        return $this->medicationName;
    }

    public function setMedicationName(string $medicationName): static
    {
        $this->medicationName = $medicationName;
        return $this;
    }

    public function getDosage(): ?string
    {
        return $this->dosage;
    }

    public function setDosage(string $dosage): static
    {
        $this->dosage = $dosage;
        return $this;
    }

    public function getFrequency(): ?string
    {
        return $this->frequency;
    }

    public function setFrequency(string $frequency): static
    {
        $this->frequency = $frequency;
        return $this;
    }

    public function getDuration(): ?string
    {
        return $this->duration;
    }

    public function setDuration(string $duration): static
    {
        $this->duration = $duration;
        return $this;
    }

    public function getInstructions(): ?string
    {
        return $this->instructions;
    }

    public function setInstructions(?string $instructions): static
    {
        $this->instructions = $instructions;
        return $this;
    }
}
