<?php

namespace App\Specialty\Dto;

class SpecialtyResponseDto
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $description,
    ) {
    }
}