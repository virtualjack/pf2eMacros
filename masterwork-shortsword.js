(async () => {
  const token = canvas.tokens.controlled[0];
  if (!token) {
    ui.notifications.warn("Please select a token first!");
    return;
  }

  // CHANGE THIS: Replace 'longsword' with the slug of your weapon
  const weaponSlug = "shortsword"; 

  const effectData = {
    type: "effect",
    name: `Masterword (${weaponSlug})`,
    img: "icons/weapons/swords/shortsword-broad-engraved.webp",
    system: {
      rules: [
        {
          key: "FlatModifier",
          selector: "attack-roll",
          value: 1,
          type: "item",
          label: "Masterwork Bonus",
          predicate: [`item:slug:${weaponSlug}`] // This limits it to one weapon
        }
      ],
      duration: {
        value: 1,
        unit: "hours",
        expiry: "turn-start"
      }
    }
  };

  await token.actor.createEmbeddedDocuments("Item", [effectData]);
  ui.notifications.info(`Masterwork +1 bonus applied to ${weaponSlug} on ${token.name}`);
})();