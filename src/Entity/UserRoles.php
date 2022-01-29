<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="user_roles")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class UserRoles
{
    /**
	 * @ORM\Id
     * @ORM\Column(type="integer")
     */
    private $user_id;
	
	 /**
     * @ORM\Column(type="integer")
     */
    private $role_id;

    public function getUserId()
    {
        return $this->user_id;
    }
	
	 public function setUserId($user_id)
    {
        $this->user_id = $user_id;
    }
	
	public function getRoleId()
    {
        return $this->role_id;
    }
	
	 public function setRoleId($role_id)
    {
        $this->role_id = $role_id;
    }
}
