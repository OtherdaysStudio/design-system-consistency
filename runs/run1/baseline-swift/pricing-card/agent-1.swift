import SwiftUI

struct PricingCard: View {
    private let features = [
        "Unlimited high-resolution exports",
        "Advanced editing tools & presets",
        "Priority support, always within a day"
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            // Status pill
            HStack(spacing: 6) {
                Image(systemName: "sparkles")
                    .font(.system(size: 11, weight: .semibold))
                Text("Most popular")
                    .font(.system(size: 12, weight: .semibold))
                    .tracking(0.3)
            }
            .foregroundStyle(Color.accentColor)
            .padding(.horizontal, 12)
            .padding(.vertical, 7)
            .background(
                Capsule(style: .continuous)
                    .fill(Color.accentColor.opacity(0.12))
            )

            // Heading + description
            VStack(alignment: .leading, spacing: 6) {
                Text("Pro")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundStyle(.primary)

                Text("Everything you need to shoot, edit, and ship like a studio.")
                    .font(.system(size: 15, weight: .regular))
                    .foregroundStyle(.secondary)
                    .lineSpacing(2)
                    .fixedSize(horizontal: false, vertical: true)
            }

            // Price
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text("$29")
                    .font(.system(size: 44, weight: .heavy))
                    .foregroundStyle(.primary)
                Text("/mo")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(.secondary)
            }

            Divider()
                .overlay(Color.primary.opacity(0.06))

            // Features
            VStack(alignment: .leading, spacing: 14) {
                ForEach(features, id: \.self) { feature in
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: "checkmark")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundStyle(Color.accentColor)
                            .frame(width: 22, height: 22)
                            .background(
                                Circle().fill(Color.accentColor.opacity(0.12))
                            )

                        Text(feature)
                            .font(.system(size: 15, weight: .regular))
                            .foregroundStyle(.primary)
                            .fixedSize(horizontal: false, vertical: true)

                        Spacer(minLength: 0)
                    }
                }
            }

            // CTA
            Button(action: {}) {
                Text("Choose Pro")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(
                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                            .fill(Color.accentColor)
                    )
            }
            .buttonStyle(PressableButtonStyle())
            .padding(.top, 2)
        }
        .padding(28)
        .background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(Color(.secondarySystemBackground))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.05), lineWidth: 1)
        )
        .shadow(color: Color.black.opacity(0.10), radius: 24, x: 0, y: 12)
        .shadow(color: Color.black.opacity(0.04), radius: 2, x: 0, y: 1)
        .padding(24)
    }
}

private struct PressableButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .opacity(configuration.isPressed ? 0.9 : 1)
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: configuration.isPressed)
    }
}

#Preview {
    ZStack {
        Color(.systemBackground).ignoresSafeArea()
        PricingCard()
    }
}
