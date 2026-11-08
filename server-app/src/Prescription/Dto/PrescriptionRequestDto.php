<?php

namespace App\Prescription\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class PrescriptionRequestDto
{
    #[Assert\NotNull(message: 'Le dossier médical est obligatoire.')]
    #[Assert\Positive(message: 'L’identifiant du dossier médical doit être positif.')]
    public ?int $medicalRecordId = null;

    #[Assert\NotBlank(message: 'La date de prescription est obligatoire.')]
    #[Assert\Date(message: 'La date doit être valide au format YYYY-MM-DD.')]
    public ?string $prescriptionDate = null;

    public ?string $notes = null;

    #[Assert\NotNull(message: 'La liste des médicaments est obligatoire.')]
    #[Assert\Count(
        min: 1,
        minMessage: 'La prescription doit contenir au moins un médicament.'
    )]
    #[Assert\All([
        new Assert\Collection(
            fields: [
                'medicationName' => [
                    new Assert\NotBlank(message: 'Le nom du médicament est obligatoire.')
                ],
                'dosage' => [
                    new Assert\NotBlank(message: 'Le dosage est obligatoire.')
                ],
                'frequency' => [
                    new Assert\NotBlank(message: 'La fréquence est obligatoire.')
                ],
                'duration' => [
                    new Assert\NotBlank(message: 'La durée du traitement est obligatoire.')
                ],
                'instructions' => new Assert\Optional([
                    new Assert\Type('string')
                ])
            ],
            allowExtraFields: false,
            allowMissingFields: false
        )
    ])]
    public ?array $medications = null;
}
