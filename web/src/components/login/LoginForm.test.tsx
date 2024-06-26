import { render, screen } from '@testing-library/react';
import LoginForm from './LoginForm.component';

describe('Tests Login Form Component', () => {
  it('Checks Inputs & button render on page', () => {
    render(<LoginForm loginData={vi.fn()}/>);

    expect(screen.getByTestId('testid-usernameTextField')).toBeTruthy();
    expect(screen.getByTestId("testid-passwordTextField")).toBeTruthy();
    expect(screen.getByTestId("testid-mfaCodeTextField")).toBeTruthy();
    expect(screen.getByTestId("testid-loginButton")).toBeTruthy();
  })
})
