<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="nodes")
 * @ORM\Entity(repositoryClass="App\Repository\NodeRepository")
 */
class Node
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $tree_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $parent_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $person_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $spouse_id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date_added;

    /**
     * @ORM\Column(type="string", length=25)
     */
    private $invite_hash;

    /**
     * @ORM\Column(type="integer")
     */
    private $user_id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $last_update;

    /**
     * @ORM\Column(type="integer")
     */
    private $deleted;


    public function getId()
    {
        return $this->id;
    }

    public function getTreeId()
    {
        return $this->tree_id;
    }

    public function setTreeId(int $tree_id)
    {
        $this->tree_id = $tree_id;

        return $this;
    }

    public function getParentId()
    {
        return $this->parent_id;
    }

    public function setParentId(int $parent_id)
    {
        $this->parent_id = $parent_id;

        return $this;
    }

    public function getPersonId()
    {
        return $this->person_id;
    }

    public function setPersonId(int $person_id)
    {
        $this->person_id = $person_id;

        return $this;
    }

    public function getSpouseId()
    {
        return $this->spouse_id;
    }

    public function setSpouseId(int $spouse_id)
    {
        $this->spouse_id = $spouse_id;

        return $this;
    }

    public function getInviteHash(){
        return $this->invite_hash;
    }

    public function setInviteHash(string $invite_hash)
    {
        $this->invite_hash = $invite_hash;

        return $this;
    }

    public function getUserId()
    {
        return $this->user_id;
    }

    public function setUserId(int $userId)
    {
        $this->user_id = $userId;

        return $this;
    }


    public function getDeleted()
    {
        return $this->deleted;
    }

    public function setDeleted(int $deleted)
    {
        $this->deleted = $deleted;

        return $this;
    }

    public function getDateAdded()
    {
        return $this->date_added;
    }

    public function setDateAdded(\DateTimeInterface $date_added)
    {
        $this->date_added = $date_added;

        return $this;
    }

    public function getLastUpdate()
    {
        return $this->last_update;
    }

    public function setLastUpdate(\DateTimeInterface $last_update)
    {
        $this->last_update = $last_update;

        return $this;
    }
}
