<?php

namespace App\Prescription\Mapper;

use App\Prescription\Dto\PrescriptionResponseDto;
use App\Prescription\Entity\Prescription;

class PrescriptionMapper
{
    public function toResponseDto(
        Prescription $prescription
    ): PrescriptionResponseDto {
        $medications = [];

        foreach ($prescription->getMedications() as $medication) {
            $medications[] = [
                'id' => $medication->getId(),
                'medicationName' => $medication->getMedicationName(),
                'dosage' => $medication->getDosage(),
                'frequency' => $medication->getFrequency(),
                'duration' => $medication->getDuration(),
                'instructions' => $medication->getInstructions(),
            ];
        }

        return new PrescriptionResponseDto(
            id: $prescription->getId(),
            medicalRecordId: $prescription
                ->getMedicalRecord()
                ->getId(),
            prescriptionDate: $prescription
                ->getPrescriptionDate()
                ?->format('Y-m-d'),
            notes: $prescription->getNotes(),
            medications: $medications,
        );
    }
}
