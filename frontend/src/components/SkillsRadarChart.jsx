import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export const SkillsRadarChart = ({ breakdown = {} }) => {
  const data = [
    { subject: 'Skills Match (40%)', candidate: breakdown.skillsMatch || 0, fullMark: 100 },
    { subject: 'Experience (20%)', candidate: breakdown.experienceMatch || 0, fullMark: 100 },
    { subject: 'Education (15%)', candidate: breakdown.educationMatch || 0, fullMark: 100 },
    { subject: 'Project Rel (10%)', candidate: breakdown.projectRelevance || 0, fullMark: 100 },
    { subject: 'Role Sim (10%)', candidate: breakdown.roleSimilarity || 0, fullMark: 100 },
    { subject: 'Certifications (5%)', candidate: breakdown.certifications || 0, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
          <Radar
            name="Candidate Compatibility"
            dataKey="candidate"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
              fontWeight: '600'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
