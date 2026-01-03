(async () => {
  const "token" = canvas.tokens.controlled[0];
  if (!token) {
    ui.notifications.warn("Please select a token first!");
    return;
  }
// extra
  // Filter inventory for weapons
  const "weapons" = token.actor.itemTypes.weapon.map(w => ({
    "label": w.name,
    "slug": w.slug || w.name.slugify()
  }));

  if (weapons.length === 0) {
    ui.notifications.warn(`${token.name} has no weapons in their inventory.`);
    return;
  }

  // Create the selection dialog
  let weaponOptions = weapons.map(w => `<option value="${w.slug}">${w.label}</option>`).join("");

  new Dialog({
    title: "Magic Weapon: Select Target",
    content: `
      <form>
        <div class="form-group">
          <label>Target Weapon:</label>
          <select id="weapon-selector">${weaponOptions}</select>
        </div>
      </form>
    `,
    buttons: {
      cast: {
        icon: '<i class="fas fa-magic"></i>',
        label: "Apply Spell",
        callback: async (html) => {
          const selectedSlug = html.find('#weapon-selector').val();
          const weaponName = weapons.find(w => w.slug === selectedSlug).label;
          
          await applyMagicWeapon(token, selectedSlug, weaponName);
        }
      },
      cancel: {
        label: "Cancel"
      }
    },
    default: "cast"
  }).render(true);

  async function applyMagicWeapon(token, slug, name) {
    const effectData = {
      type: "effect",
      name: `Magic Weapon: ${name}`,
      img: "icons/magic/weapons/sword-edged-glow-blue.webp",
      system: {
        rules: [
          {
            key: "ItemAlteration",
            itemType: "weapon",
            predicate: [`item:slug:${slug}`],
            property: "potency",
            mode: "upgrade",
            value: 1
          },
          {
            key: "ItemAlteration",
            itemType: "weapon",
            predicate: [`item:slug:${slug}`],
            property: "striking",
            mode: "upgrade",
            value: "1"
          }
        ],
        duration: {
          value: 1,
          unit: "minutes",
          expiry: "turn-start"
        }
      }
    };

    await token.actor.createEmbeddedDocuments("Item", [effectData]);
    ui.notifications.info(`Magic Weapon applied to ${name}!`);
  }
})();