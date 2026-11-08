<?php

namespace App\Prescription\Entity;

use App\MedicalRecord\Entity\MedicalRecord;
use App\Prescription\Repository\PrescriptionRepository;
use App\Shared\Entity\BaseEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PrescriptionRepository::class)]
#[ORM\Table(name: 'prescriptions')]
class Prescription extends BaseEntity
{
    #[ORM\ManyToOne(targetEntity: MedicalRecord::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'RESTRICT')]
    private ?MedicalRecord $medicalRecord = null;

    #[ORM\Column(type: 'date_immutable')]
    private ?\DateTimeImmutable $prescriptionDate = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $notes = null;

    #[ORM\OneToMany( mappedBy: 'prescription', targetEntity: PrescriptionMedication::class,
        cascade: ['persist'],orphanRemoval: true
    )]
    private Collection $medications;

    public function __construct()
    {
        $this->medications = new ArrayCollection();
    }

    public function getMedicalRecord(): ?MedicalRecord
    {
      return $this->medicalRecord;
    }

    public function setMedicalRecord(
        MedicalRecord $medicalRecord
    ): static {
        $this->medicalRecord = $medicalRecord;

        return $this;
    }

    public function getPrescriptionDate(): ?\DateTimeImmutable
    {
        return $this->prescriptionDate;
    }

    public function setPrescriptionDate(
        \DateTimeImmutable $prescriptionDate
    ): static {
        $this->prescriptionDate = $prescriptionDate;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    public function getMedications(): Collection
    {
        return $this->medications;
    }

    public function addMedication(
        PrescriptionMedication $medication
    ): static {
        if (!$this->medications->contains($medication)) {
            $this->medications->add($medication);
            $medication->setPrescription($this);
        }
        return $this;
    }

    public function removeMedication(
        PrescriptionMedication $medication
    ): static {
        if ($this->medications->removeElement($medication)) {
            if ($medication->getPrescription() === $this) {
                $medication->setPrescription(null);
            }
        }

        return $this;
    }
}
