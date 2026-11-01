import React from 'react';
import { Award, Code2, Cpu, Database, Eye } from 'lucide-react';

export default function ContributorsSection() {
  const contributors = [
    {
      name: 'Aditya Kate',
      role: 'Project Contributor',
      initials: 'AK',
      focus: 'System Architecture & Full-Stack Pipeline',
      icon: <Code2 size={20} strokeWidth={2} />,
    },
    {
      name: 'Suman Manik',
      role: 'Project Contributor',
      initials: 'SM',
      focus: 'Computer Vision & Deep Learning Models',
      icon: <Eye size={20} strokeWidth={2} />,
    },
    {
      name: 'Tanmay Harmalkar',
      role: 'Project Contributor',
      initials: 'TH',
      focus: 'Marine Dataset Engineering & Benchmarks',
      icon: <Database size={20} strokeWidth={2} />,
    },
    {
      name: 'Abdullah Khan',
      role: 'Project Contributor',
      initials: 'AK',
      focus: 'Inference Engine & Environmental Analytics',
      icon: <Cpu size={20} strokeWidth={2} />,
    },
  ];

  return (
    <section id="contributors" className="ns-contributors-root">
      <div className="ns-contributors-container">
        <div className="ns-section-header">
          <div className="ns-sub-tag">PROJECT TEAM</div>
          <h2 className="ns-section-title">Contributors</h2>
          <p className="ns-section-subtitle">
            The research and engineering team behind the NirmalSagar underwater marine debris detection system.
          </p>
        </div>

        <div className="ns-contributors-grid">
          {contributors.map((member, idx) => (
            <div key={idx} className="ns-contributor-card">
              <div className="ns-contributor-card-top">
                <div className="ns-contributor-avatar">
                  <span>{member.initials}</span>
                </div>
                <div className="ns-contributor-icon-tag" title={member.focus}>
                  {member.icon}
                </div>
              </div>

              <div className="ns-contributor-info">
                <h3 className="ns-contributor-name">{member.name}</h3>
                <span className="ns-contributor-role">
                  <Award size={13} className="ns-role-badge-icon" />
                  {member.role}
                </span>
                <p className="ns-contributor-focus">{member.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
