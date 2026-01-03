(async () => {
  const token = canvas.tokens.controlled[0];
  if (!token) {
    ui.notifications.warn("Please select a token first!");
    return;
  }

  // Filter inventory for weapons
  const weapons = token.actor.itemTypes.weapon.map(w => ({
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
          <label>Striking Weapon:</label>
          <select id="striking-weapon-selector">${weaponOptions}</select>
        </div>
        <div class="form-group">
          <label>+1 Weapon:</label>
          <select id="plusone-weapon-selector">${weaponOptions}</select>
        </div>
      </form>
    `,
    buttons: {
      cast: {
        icon: '<i class="fas fa-magic"></i>',
        label: "Apply Vambrace Effect",
        callback: async (html) => {
          const strikingSlug = html.find('#striking-weapon-selector').val();
          const strikingWeaponName = weapons.find(w => w.slug === strikingSlug).label;
          const plusoneSlug = html.find('#plusone-weapon-selector').val();
          const plusOneWeaponName = weapons.find(w => w.slug === plusoneSlug).label;
          
          await applyVambraceEffect(token, strikingSlug, strikingWeaponName,plusoneSlug,plusOneWeaponName);
        }
      },
      cancel: {
        label: "Cancel"
      }
    },
    default: "cast"
  }).render(true);

  async function applyVambraceEffect(token, strikingSlug, strikingName, plusoneSlug, plusoneName) {
    const effectData = {
      type: "effect",
      name: `Vambrace Striking: ${strikingName}; +1: ${plusoneName} `,
      img: "icons/equipment/wrist/bracer-leather-purple-steel.webp",
      system: {
        rules: [
          {
            key: "ItemAlteration",
            itemType: "weapon",
            predicate: [`item:slug:${plusoneSlug}`],
            property: "potency",
            mode: "upgrade",
            value: 1
          },
          {
            key: "ItemAlteration",
            itemType: "weapon",
            predicate: [`item:slug:${strikingSlug}`],
            property: "potency",
            mode: "upgrade",
            value: 1
          },
          {
            key: "ItemAlteration",
            itemType: "weapon",
            predicate: [`item:slug:${strikingSlug}`],
            property: "striking",
            mode: "upgrade",
            value: "1"
          }
        ],
        duration: {
          value: 2,
          unit: "minutes",
          expiry: "turn-end"
        }
      }
    };

    await token.actor.createEmbeddedDocuments("Item", [effectData]);
    ui.notifications.info(`Magic Weapon applied to ${name}!`);
  }
})();