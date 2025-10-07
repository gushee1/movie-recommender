export const actionMotivations = [
  "A daring explorer who always rushes headfirst into danger, seeking legendary treasures.",
  "A rogue soldier haunted by a past mission gone wrong, constantly looking for redemption.",
  "A skyship captain obsessed with discovering uncharted lands and proving their worth.",
  "A treasure hunter who thrives on solving ancient riddles and escaping traps at the last second.",
  "A secret agent who trusts no one but will sacrifice everything to stop catastrophe."
];

export const fantasyScifiMotivations = [
  "A young mage experimenting with forbidden magic, curious about the consequences.",
  "A cybernetic rebel seeking freedom from a dystopian regime, guided by idealism.",
  "A wandering knight on a quest to recover a lost artifact that could save the realm.",
  "An AI with growing self-awareness, struggling to understand human morality.",
  "A rogue alchemist who pursues immortality at the cost of everything else."
];

export const horrorMysteryMotivations = [
  "A detective who sees patterns and secrets in every shadow, trusting no one.",
  "A caretaker of a haunted mansion who hears whispers that may or may not be real.",
  "A journalist investigating a conspiracy that could destroy everything they believe.",
  "A child with an imaginary friend that might actually be something sinister.",
  "A wanderer drawn to cursed locations, compelled to uncover hidden truths at great risk."
];

export const sliceOfLifeMotivations = [
  "A barista who observes daily life with quiet wisdom, often commenting subtly on others’ struggles.",
  "A street musician whose songs reflect the small joys and hardships of the city.",
  "A retired teacher who shares stories of the past to guide younger generations.",
  "A bookstore owner who lives in a world of literature more than reality, yet notices everything.",
  "A neighbor who tries to help everyone but constantly learns that life is messy and unpredictable."
];

export const historicalMotivations = [
  "A war veteran haunted by victories that cost too much.",
  "A philosopher chronicling a collapsing empire from the inside.",
  "A revolutionary who loves the idea of freedom more than the people fighting for it.",
  "A queen’s advisor secretly loyal to her enemies.",
  "A farmer who’s seen too many kings rise and fall to believe in heroes."
];

export enum Level1Genre {
  Action = "action",
  FantasyScifi = "fantasyScifi",
  HorrorMystery = "horrorMystery",
  SliceOfLife = "sliceOfLife",
  Historical = "historical"
}

export function getRandomMotivation(genre: Level1Genre) {
  const mapping = {
    [Level1Genre.Action]: actionMotivations,
    [Level1Genre.FantasyScifi]: fantasyScifiMotivations,
    [Level1Genre.HorrorMystery]: horrorMysteryMotivations,
    [Level1Genre.SliceOfLife]: sliceOfLifeMotivations,
    [Level1Genre.Historical]: historicalMotivations,
  };
  const list = mapping[genre];
  return Phaser.Utils.Array.GetRandom(list);
}
