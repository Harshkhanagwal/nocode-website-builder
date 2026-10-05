
const express = require("express");
const router = express.Router();

const {
  createHero,
  getHeroes,
  getHeroById,
  updateHero,
  deleteHero,
} = require("../controllers/heroController");

router.post("/", createHero);
router.get("/", getHeroes);
router.get("/:id", getHeroById);
router.put("/:id", updateHero);
router.delete("/:id", deleteHero);

module.exports = router;
