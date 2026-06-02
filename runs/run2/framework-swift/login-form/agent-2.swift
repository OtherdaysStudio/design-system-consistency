import SwiftUI

/// Sign-in form for the Aperture iOS app.
///
/// Built entirely from registered Aperture DS components — no hand-rolled native
/// Button/TextField, no raw `.background().cornerRadius()` card chain, no
/// `.font(.system(size:))`. All spacing is expressed through `DSStack(gap:)` and
/// the card owns its own inset via `.dsCard(_:)`; type is set only through
/// `DSText(_:_:)` presets. The full-width primary button stretches via
/// `.frame(maxWidth:)` using the canonical infinity sentinel (no raw width token).
struct LoginForm: View {
    @State private var email: String = ""
    @State private var password: String = ""

    var body: some View {
        DSStack(.vertical, gap: .lg) {
            // Header
            DSStack(.vertical, gap: .xs) {
                DSText("Welcome back", .title)
                DSText(
                    "Sign in to continue to Aperture",
                    .body,
                    color: .dsTextSecondary
                )
            }

            // Email field (label + input)
            DSStack(.vertical, gap: .xs) {
                DSText("Email", .label, color: .dsTextSecondary)
                DSTextField("you@example.com", text: $email)
            }

            // Password field (label + input)
            DSStack(.vertical, gap: .xs) {
                DSText("Password", .label, color: .dsTextSecondary)
                DSTextField("Enter your password", text: $password)
            }

            // Actions
            DSStack(.vertical, gap: .sm) {
                DSButton("Sign in", action: signIn)
                    .dsButtonStyle(.primary, .lg)
                    .frame(maxWidth: .infinity)

                DSButton("Create account", action: createAccount)
                    .dsButtonStyle(.ghost, .lg)
                    .frame(maxWidth: .infinity)
            }
        }
        .dsCard(.elevated)
    }

    private func signIn() {
        // Wire to authentication.
    }

    private func createAccount() {
        // Wire to registration flow.
    }
}
