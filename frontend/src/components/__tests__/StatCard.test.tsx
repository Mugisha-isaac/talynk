import { render, screen } from '@testing-library/react';
import { Zap } from 'lucide-react';
import { StatCard } from '@/components/StatCard';

describe('StatCard', () => {
  it('renders the title, value, and subtitle', () => {
    render(
      <StatCard icon={Zap} title="Active Talents" value={128} subtitle="up 12% this month" />
    );

    expect(screen.getByText('Active Talents')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('up 12% this month')).toBeInTheDocument();
  });

  it('omits the subtitle paragraph when none is provided', () => {
    render(<StatCard icon={Zap} title="Matches" value="10k+" />);

    expect(screen.getByText('Matches')).toBeInTheDocument();
    expect(screen.getByText('10k+')).toBeInTheDocument();
    expect(screen.queryByText(/up \d+%/)).not.toBeInTheDocument();
  });
});
