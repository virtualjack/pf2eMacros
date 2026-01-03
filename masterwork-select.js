(async () => {
  const token = canvas.tokens.controlled[0];
  if (!token) {
    ui.notifications.warn("Please select a token first!");
    return;
  }

  // Filter inventory for weapons
  const weapons = token.actor.itemTypes.weapon.map(w => ({
    label: w.name,
    slug: w.slug || w.name.slugify()
  }));

  if (weapons.length === 0) {
    ui.notifications.warn(`${token.name} has no weapons in their inventory.`);
    return;
  }

  // Create the selection dialog
  let weaponOptions = weapons.map(w => `<option value="${w.slug}">${w.label}</option>`).join("");

  new Dialog({
    title: "Apply Item Bonus",
    content: `
      <form>
        <div class="form-group">
          <label>Target Weapon:</label>
          <select id="weapon-selector">${weaponOptions}</select>
        </div>
      </form>
    `,
    buttons: {
      apply: {
        icon: '<i class="fas fa-hammer"></i>',
        label: "Apply +1 Bonus",
        callback: async (html) => {
          const selectedSlug = html.find('#weapon-selector').val();
          const weaponName = weapons.find(w => w.slug === selectedSlug).label;
          
          await applyItemBonus(token, selectedSlug, weaponName);
        }
      },
      cancel: {
        label: "Cancel"
      }
    },
    default: "apply"
  }).render(true);

  async function applyItemBonus(token, slug, name) {
    const effectData = {
      type: "effect",
      name: `Bonus: ${name} (+1)`,
      img: "icons/tools/smithing/anvil.webp",
      system: {
        rules: [
          {
            key: "FlatModifier",
            selector: "attack-roll",
            value: 1,
            type: "item",
            label: `Masterwork Bonus to ${name}`,
            predicate: [`item:slug:${slug}`]
          }
        ],
        duration: {
          value: 10,
          unit: "hours",
          expiry: "turn-start"
        }
      }
    };

    await token.actor.createEmbeddedDocuments("Item", [effectData]);
    ui.notifications.info(`+1 Item Bonus applied specifically to ${name}!`);
  }
})();