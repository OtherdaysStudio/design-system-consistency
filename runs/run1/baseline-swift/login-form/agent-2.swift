import SwiftUI

struct LoginForm: View {
    @State private var email: String = ""
    @State private var password: String = ""
    @FocusState private var focusedField: Field?

    private enum Field {
        case email
        case password
    }

    var body: some View {
        ZStack {
            Color(.systemGroupedBackground)
                .ignoresSafeArea()

            VStack(spacing: 28) {
                header

                VStack(spacing: 18) {
                    LabeledField(
                        label: "Email",
                        text: $email,
                        placeholder: "you@example.com",
                        systemImage: "envelope",
                        isSecure: false,
                        contentType: .emailAddress,
                        keyboard: .emailAddress
                    )
                    .focused($focusedField, equals: .email)
                    .submitLabel(.next)
                    .onSubmit { focusedField = .password }

                    LabeledField(
                        label: "Password",
                        text: $password,
                        placeholder: "Enter your password",
                        systemImage: "lock",
                        isSecure: true,
                        contentType: .password,
                        keyboard: .default
                    )
                    .focused($focusedField, equals: .password)
                    .submitLabel(.go)
                    .onSubmit { signIn() }

                    Button("Forgot password?") {}
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(Color.accentColor)
                        .frame(maxWidth: .infinity, alignment: .trailing)
                        .buttonStyle(.plain)
                }

                VStack(spacing: 12) {
                    Button(action: signIn) {
                        Text("Sign in")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                    }
                    .buttonStyle(PrimaryButtonStyle())

                    Button(action: createAccount) {
                        Text("Create account")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                    }
                    .buttonStyle(GhostButtonStyle())
                }
            }
            .padding(28)
            .background(
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .fill(Color(.secondarySystemGroupedBackground))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .strokeBorder(Color.primary.opacity(0.06), lineWidth: 1)
            )
            .shadow(color: Color.black.opacity(0.08), radius: 24, x: 0, y: 12)
            .padding(.horizontal, 24)
            .frame(maxWidth: 440)
        }
    }

    private var header: some View {
        VStack(spacing: 8) {
            Image(systemName: "camera.aperture")
                .font(.system(size: 40, weight: .regular))
                .foregroundStyle(Color.accentColor)
                .padding(.bottom, 4)

            Text("Welcome back")
                .font(.system(.largeTitle, design: .rounded).weight(.bold))
                .foregroundStyle(.primary)

            Text("Sign in to continue to Aperture")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
    }

    private func signIn() {
        focusedField = nil
    }

    private func createAccount() {
        focusedField = nil
    }
}

private struct LabeledField: View {
    let label: String
    @Binding var text: String
    let placeholder: String
    let systemImage: String
    let isSecure: Bool
    let contentType: UITextContentType
    let keyboard: UIKeyboardType

    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.secondary)

            HStack(spacing: 12) {
                Image(systemName: systemImage)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(isFocused ? Color.accentColor : .secondary)
                    .frame(width: 20)

                Group {
                    if isSecure {
                        SecureField(placeholder, text: $text)
                    } else {
                        TextField(placeholder, text: $text)
                            .textInputAutocapitalization(.never)
                    }
                }
                .font(.body)
                .focused($isFocused)
                .textContentType(contentType)
                .keyboardType(keyboard)
                .autocorrectionDisabled(true)
            }
            .padding(.horizontal, 16)
            .frame(height: 52)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(Color(.tertiarySystemGroupedBackground))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .strokeBorder(
                        isFocused ? Color.accentColor : Color.primary.opacity(0.08),
                        lineWidth: isFocused ? 1.5 : 1
                    )
            )
            .animation(.easeInOut(duration: 0.15), value: isFocused)
        }
    }
}

private struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(.white)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(Color.accentColor)
            )
            .opacity(configuration.isPressed ? 0.85 : 1)
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeInOut(duration: 0.12), value: configuration.isPressed)
    }
}

private struct GhostButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(Color.accentColor)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(Color.accentColor.opacity(configuration.isPressed ? 0.12 : 0.0))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .strokeBorder(Color.accentColor.opacity(0.4), lineWidth: 1.5)
            )
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeInOut(duration: 0.12), value: configuration.isPressed)
    }
}

#Preview {
    LoginForm()
}
