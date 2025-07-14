import type { Pet, PetAnalytics } from '../types/pet.types';

export const calculatePetAnalytics = (pets: Pet[]): PetAnalytics => {
	const totalPets = pets.length;

	// Species distribution
	const speciesCount = pets.reduce(
		(acc, pet) => {
			acc[pet.species] = (acc[pet.species] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	const speciesDistribution = Object.entries(speciesCount).map(
		([name, value]) => ({
			name: capitalizeFirstLetter(name),
			value,
			percentage: Math.round((value / totalPets) * 100),
		})
	);

	// Age distribution
	const ageRanges = { '0-2': 0, '3-7': 0, '8-12': 0, '13+': 0 };
	pets.forEach((pet) => {
		if (pet.age <= 2) ageRanges['0-2']++;
		else if (pet.age <= 7) ageRanges['3-7']++;
		else if (pet.age <= 12) ageRanges['8-12']++;
		else ageRanges['13+']++;
	});

	const ageDistribution = Object.entries(ageRanges).map(([range, count]) => ({
		range,
		count,
		percentage: Math.round((count / totalPets) * 100),
	}));

	// Average age
	const averageAge = pets.reduce((sum, pet) => sum + pet.age, 0) / totalPets;

	// Most common breed
	const breedCount = pets.reduce(
		(acc, pet) => {
			acc[pet.breed] = (acc[pet.breed] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	const mostCommonBreed =
		Object.entries(breedCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
		'Unknown';

	// Recently added pets (last 7 days)
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const recentlyAdded = pets
		.filter((pet) => new Date(pet.createdAt) > sevenDaysAgo)
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)
		.slice(0, 5);

	return {
		totalPets,
		speciesDistribution,
		ageDistribution,
		averageAge: Math.round(averageAge * 10) / 10,
		mostCommonBreed,
		recentlyAdded,
	};
};

function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
