<?php

namespace App\Auth\Register\Admin\Enum;

enum AdminRole: string
{
    case MANAGER = 'ROLE_MANAGER';
    case ADMIN = 'ROLE_ADMIN';
    case USER = 'ROLE_USER';
    case DOCTOR = 'ROLE_DOCTOR';
}