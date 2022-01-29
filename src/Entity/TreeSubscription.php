<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="tree_subscription")
 * @ORM\Entity(repositoryClass="App\Repository\TreeSubscriptionRepository")
 */
class TreeSubscription
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
    private $user_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $tree_id;

    public function getId()
    {
        return $this->id;
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function setUserId(int $user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getTreeId(): ?int
    {
        return $this->tree_id;
    }

    public function setTreeId(int $tree_id): self
    {
        $this->tree_id = $tree_id;

        return $this;
    }
}
