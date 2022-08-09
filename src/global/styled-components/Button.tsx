import styled from "@emotion/styled";

const Sizes = {
  "x-sm": 16,
  sm: 18,
  md: 20,
  lg: 22,
  "x-lg": 28,
};
interface Props {
  size: "x-sm" | "sm" | "md" | "lg" | "x-lg";
  padding: "x-sm" | "sm" | "md" | "lg" | "x-lg";
}
const PrimaryButton = styled.button<Props>`
  font-weight: 300;
  font-size: ${({ size }) => Sizes[size] + "px"};
  background-color: var(--primary-color);
  color: var(--pitch-black-color);
  padding: 0.4rem 2rem;
  border: 1px solid transparent;
  display: flex;
  align-self: center;
  justify-content: center;
  text-align: center;

  &:hover {
    background-color: var(--primary-dark-color);
    cursor: pointer;
  }

  &:disabled {
    background-color: var(--dark-grey-color);
    color: var(--holy-grey-color);
  }
`;

const OutlinedButton = styled(PrimaryButton)<Props>`
  background-color: var(--pitch-black-color);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  &:disabled {
    color: var(--holy-grey-color);
    background-color: var(--pitch-black-color);
    border: 1px solid var(--holy-grey-color);
  }
`;

const FilledButton = styled(PrimaryButton)<Props>`
  background-color: var(--too-dark-color);
  color: var(--off-white-color);
  &:hover {
    background-color: var(--dark-grey-color);
    color: var(--off-white-color);
    border: 1px solid var(--dark-grey-color);
  }
  &:disabled {
    background-color: var(--dark-grey-color);
    color: var(--holy-grey-color);
  }
`;

export { PrimaryButton, OutlinedButton, FilledButton };
