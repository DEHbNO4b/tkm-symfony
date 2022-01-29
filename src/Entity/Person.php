<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="persons")
 * @ORM\Entity(repositoryClass="App\Repository\PersonRepository")
 */
class Person
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=40)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $gender;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $photo;


    /**
     * @ORM\Column(type="datetime")
     */
    private $birth_date;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dead_date;    


    /**
     * @ORM\Column(type="datetime")
     */
    private $date_added;

    /**
     * @ORM\Column(type="datetime")
     */
    private $last_update;




    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName(string $name)
    {
        $this->name = $name;

        return $this;
    }

    public function getGender()
    {
        return $this->gender;
    }

    public function setGender(string $gender)
    {
        $this->gender = $gender;

        return $this;
    }

    public function getPhoto()
    {
        return $this->photo;
    }

    public function setPhoto(string $photo)
    {
        $this->photo = $photo;

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

    public function getBirthDate()
    {
        return $this->birth_date;
    }

    public function setBirthDate(\DateTimeInterface $birth_date)
    {
        $this->birth_date = $birth_date;

        return $this;
    }

    public function getDeadDate()
    {
        return $this->dead_date;
    }

    public function setDeadDate(\DateTimeInterface $dead_date)
    {
        $this->dead_date = $dead_date;

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
