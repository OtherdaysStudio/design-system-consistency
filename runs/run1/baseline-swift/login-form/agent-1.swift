import SwiftUI

struct LoginForm: View {
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var isPasswordVisible: Bool = false

    @FocusState private var focusedField: Field?

    private enum Field {
        case email
        case password
    }

    var body: some View {
        ZStack {
            backgroundGradient
                .ignoresSafeArea()

            ScrollView {
                VStack {
                    card
                        .frame(maxWidth: 420)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 40)
                }
                .frame(maxWidth: .infinity)
            }
        }
    }

    // MARK: - Card

    private var card: some View {
        VStack(alignment: .leading, spacing: 28) {
            header
            fields
            actions
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
        .shadow(color: Color.black.opacity(0.12), radius: 28, x: 0, y: 18)
    }

    // MARK: - Header

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Welcome back")
                .font(.system(.largeTitle, design: .rounded).weight(.bold))
                .foregroundStyle(.primary)

            Text("Sign in to continue to Aperture.")
                .font(.system(.subheadline, design: .rounded))
                .foregroundStyle(.secondary)
        }
    }

    // MARK: - Fields

    private var fields: some View {
        VStack(alignment: .leading, spacing: 20) {
            fieldGroup(
                label: "Email",
                content: emailField
            )
            fieldGroup(
                label: "Password",
                content: passwordField
            )
        }
    }

    private func fieldGroup<Content: View>(
        label: String,
        @ViewBuilder content: () -> Content
    ) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.system(.footnote, design: .rounded).weight(.semibold))
                .foregroundStyle(.secondary)
            content()
        }
    }

    private var emailField: some View {
        HStack(spacing: 12) {
            Image(systemName: "envelope")
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(.secondary)
                .frame(width: 20)

            TextField("you@example.com", text: $email)
                .font(.system(.body, design: .rounded))
                .textContentType(.emailAddress)
                .keyboardType(.emailAddress)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled(true)
                .focused($focusedField, equals: .email)
                .submitLabel(.next)
                .onSubmit { focusedField = .password }
        }
        .modifier(FieldContainer(isFocused: focusedField == .email))
    }

    private var passwordField: some View {
        HStack(spacing: 12) {
            Image(systemName: "lock")
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(.secondary)
                .frame(width: 20)

            Group {
                if isPasswordVisible {
                    TextField("Enter your password", text: $password)
                } else {
                    SecureField("Enter your password", text: $password)
                }
            }
            .font(.system(.body, design: .rounded))
            .textContentType(.password)
            .textInputAutocapitalization(.never)
            .autocorrectionDisabled(true)
            .focused($focusedField, equals: .password)
            .submitLabel(.go)
            .onSubmit(handleSignIn)

            Button {
                isPasswordVisible.toggle()
            } label: {
                Image(systemName: isPasswordVisible ? "eye.slash" : "eye")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(.secondary)
                    .frame(width: 20)
            }
            .buttonStyle(.plain)
            .accessibilityLabel(isPasswordVisible ? "Hide password" : "Show password")
        }
        .modifier(FieldContainer(isFocused: focusedField == .password))
    }

    // MARK: - Actions

    private var actions: some View {
        VStack(spacing: 12) {
            Button(action: handleSignIn) {
                Text("Sign in")
                    .font(.system(.body, design: .rounded).weight(.semibold))
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
            }
            .buttonStyle(PrimaryButtonStyle())

            Button(action: handleCreateAccount) {
                Text("Create account")
                    .font(.system(.body, design: .rounded).weight(.semibold))
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
            }
            .buttonStyle(GhostButtonStyle())
        }
    }

    // MARK: - Handlers

    private func handleSignIn() {
        focusedField = nil
    }

    private func handleCreateAccount() {
        focusedField = nil
    }

    // MARK: - Background

    private var backgroundGradient: some View {
        LinearGradient(
            colors: [
                Color(.systemGroupedBackground),
                Color(.systemGroupedBackground).opacity(0.92)
            ],
            startPoint: .top,
            endPoint: .bottom
        )
    }
}

// MARK: - Field Container

private struct FieldContainer: ViewModifier {
    let isFocused: Bool

    func body(content: Content) -> some View {
        content
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
                        lineWidth: isFocused ? 2 : 1
                    )
            )
            .animation(.easeInOut(duration: 0.18), value: isFocused)
    }
}

// MARK: - Button Styles

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
                    .fill(Color.accentColor.opacity(configuration.isPressed ? 0.12 : 0.06))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .strokeBorder(Color.accentColor.opacity(0.25), lineWidth: 1)
            )
            .opacity(configuration.isPressed ? 0.9 : 1)
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeInOut(duration: 0.12), value: configuration.isPressed)
    }
}

// MARK: - Preview

#Preview {
    LoginForm()
}
