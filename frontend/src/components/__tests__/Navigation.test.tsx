import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from '@/components/Navigation';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ user: null }),
  });
});

describe('Navigation', () => {
  it('shows login and sign up links when logged out', async () => {
    render(<Navigation isAuthenticated={false} />);

    expect((await screen.findAllByText('Login')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('Sign Up')).length).toBeGreaterThan(0);
  });

  it('shows the dashboard link and hides Sponsors for a TALENT user', async () => {
    render(<Navigation isAuthenticated userRole="TALENT" />);

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Sponsors')).not.toBeInTheDocument();
  });

  it('shows Sponsors link for a SPONSOR user', async () => {
    render(<Navigation isAuthenticated userRole="SPONSOR" />);

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sponsors')).toBeInTheDocument();
  });

  it('toggles the mobile menu open and closed', async () => {
    const user = userEvent.setup();
    render(<Navigation isAuthenticated={false} />);

    // Mobile nav content isn't in the document until opened
    await screen.findAllByText('Login');
    const toggleButtons = screen.getAllByRole('button');
    const menuButton = toggleButtons[toggleButtons.length - 1];

    expect(screen.getAllByText('Talents')).toHaveLength(1); // only the desktop link

    await user.click(menuButton);
    expect(screen.getAllByText('Talents')).toHaveLength(2); // desktop + mobile

    await user.click(menuButton);
    expect(screen.getAllByText('Talents')).toHaveLength(1);
  });
});
