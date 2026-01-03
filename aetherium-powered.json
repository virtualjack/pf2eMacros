(async () => {
  const token = canvas.tokens.controlled[0];
  if (!token) {
    ui.notifications.warn("Please select a token first!");
    return;
  }

  // CHANGE THIS: Replace 'shortsword' with your weapon's slug
  const weaponSlug = "shortsword"; 

  const effectData = {
    type: "effect",
    name: `Aetherium Powered: ${weaponSlug}`,
    img: "icons/weapons/swords/shortsword-broad-blue.webp",
    system: {
      rules: [
        {
          key: "ItemAlteration",
          itemType: "weapon",
          predicate: [`item:slug:${weaponSlug}`],
          property: "potency",
          mode: "upgrade",
          value: 1
        },
        {
          key: "ItemAlteration",
          itemType: "weapon",
          predicate: [`item:slug:${weaponSlug}`],
          property: "striking",
          mode: "upgrade",
          value: "1"
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
  ui.notifications.info(`Aetherium Powered applied to ${weaponSlug}!`);
})();