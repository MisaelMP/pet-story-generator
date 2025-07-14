import React from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import type { Pet } from '../types/pet.types';

interface PetAnalyticsProps {
	pets: Pet[];
}

export const PetAnalytics: React.FC<PetAnalyticsProps> = ({ pets }) => {
	const ageDistribution = React.useMemo(() => {
		const ranges = { '0-2': 0, '3-7': 0, '8-12': 0, '13+': 0 };
		pets.forEach((pet) => {
			if (pet.age <= 2) ranges['0-2']++;
			else if (pet.age <= 7) ranges['3-7']++;
			else if (pet.age <= 12) ranges['8-12']++;
			else ranges['13+']++;
		});
		return Object.entries(ranges).map(([range, count]) => ({ range, count }));
	}, [pets]);

	const speciesDistribution = React.useMemo(() => {
		const species = pets.reduce(
			(acc, pet) => {
				acc[pet.species] = (acc[pet.species] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		return Object.entries(species).map(([name, value]) => ({ name, value }));
	}, [pets]);

	const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-6'>
			<div className='bg-white rounded-xl shadow-lg p-6'>
				<h3 className='text-xl font-semibold mb-6 text-gray-800'>
					Age Distribution
				</h3>
				<ResponsiveContainer width='100%' height={300}>
					<BarChart data={ageDistribution}>
						<CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
						<XAxis dataKey='range' stroke='#6B7280' />
						<YAxis stroke='#6B7280' />
						<Tooltip
							contentStyle={{
								backgroundColor: '#F9FAFB',
								border: '1px solid #E5E7EB',
								borderRadius: '8px',
							}}
						/>
						<Bar dataKey='count' fill='#3B82F6' radius={[4, 4, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className='bg-white rounded-xl shadow-lg p-6'>
				<h3 className='text-xl font-semibold mb-6 text-gray-800'>
					Species Breakdown
				</h3>
				<ResponsiveContainer width='100%' height={300}>
					<PieChart>
						<Pie
							data={speciesDistribution}
							cx='50%'
							cy='50%'
							labelLine={false}
							label={({ name, percent }) =>
								`${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
							}
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
						>
							{speciesDistribution.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
