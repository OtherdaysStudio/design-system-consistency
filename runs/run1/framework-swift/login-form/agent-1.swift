import SwiftUI

struct LoginForm: View {
    @State private var email: String = ""
    @State private var password: String = ""

    var body: some View {
        DSStack(.vertical, gap: .lg) {
            DSStack(.vertical, gap: .xs) {
                DSText("Welcome back", .title)
                DSText("Sign in to continue to Aperture", .body, color: .dsTextSecondary)
            }

            DSStack(.vertical, gap: .md) {
                DSStack(.vertical, gap: .xs) {
                    DSText("Email", .label)
                    DSTextField("you@example.com", text: $email)
                }

                DSStack(.vertical, gap: .xs) {
                    DSText("Password", .label)
                    DSTextField("Enter your password", text: $password)
                }
            }

            DSStack(.vertical, gap: .sm) {
                DSButton("Sign in") {
                    signIn()
                }
                .dsButtonStyle(.primary, .lg)
                .frame(maxWidth: .infinity)

                DSButton("Create account") {
                    createAccount()
                }
                .dsButtonStyle(.ghost, .lg)
                .frame(maxWidth: .infinity)
            }
        }
        .dsCard(.elevated)
    }

    private func signIn() {}
    private func createAccount() {}
}
