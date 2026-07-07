import { render, screen } from '@testing-library/react';
import { Music } from 'lucide-react';
import { CategoryCard } from '@/components/CategoryCard';

describe('CategoryCard', () => {
  it('renders title, description, and a link to href', () => {
    render(
      <CategoryCard
        title="Music"
        description="Discover talented musicians"
        photoId="abc123"
        href="/talents?category=music"
      />
    );

    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Discover talented musicians')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/talents?category=music');
  });

  it('renders the count badge only when a count is provided', () => {
    const { rerender } = render(
      <CategoryCard title="Music" description="d" photoId="abc" href="/x" count={42} />
    );
    expect(screen.getByText('42 talents')).toBeInTheDocument();

    rerender(<CategoryCard title="Music" description="d" photoId="abc" href="/x" />);
    expect(screen.queryByText(/talents$/)).not.toBeInTheDocument();
  });

  it('renders the optional icon when provided', () => {
    const { container } = render(
      <CategoryCard title="Music" description="d" photoId="abc" href="/x" icon={Music} />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
