import SwiftUI

struct PricingCard: View {
    private let features = [
        "Unlimited high-resolution exports",
        "Advanced RAW editing tools",
        "Priority cloud sync & backup"
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            statusPill
                .padding(.bottom, 20)

            Text("Pro")
                .font(.system(.title, design: .rounded).weight(.bold))
                .foregroundStyle(.primary)

            Text("For photographers who want every tool unlocked.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.top, 4)
                .fixedSize(horizontal: false, vertical: true)

            priceRow
                .padding(.top, 20)

            Divider()
                .padding(.vertical, 20)

            VStack(alignment: .leading, spacing: 14) {
                ForEach(features, id: \.self) { feature in
                    featureRow(feature)
                }
            }

            ctaButton
                .padding(.top, 24)
        }
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(Color(.secondarySystemGroupedBackground))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.06), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.12), radius: 24, x: 0, y: 12)
        .padding(24)
    }

    private var statusPill: some View {
        HStack(spacing: 6) {
            Image(systemName: "star.fill")
                .font(.system(size: 11, weight: .bold))
            Text("Most popular")
                .font(.caption.weight(.semibold))
                .textCase(.uppercase)
                .kerning(0.5)
        }
        .foregroundStyle(.white)
        .padding(.horizontal, 12)
        .padding(.vertical, 7)
        .background(
            Capsule(style: .continuous)
                .fill(Color.accentColor)
        )
    }

    private var priceRow: some View {
        HStack(alignment: .firstTextBaseline, spacing: 6) {
            Text("$29")
                .font(.system(size: 48, weight: .bold, design: .rounded))
                .foregroundStyle(.primary)
            Text("/mo")
                .font(.headline)
                .foregroundStyle(.secondary)
        }
    }

    private func featureRow(_ text: String) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 12) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 17, weight: .semibold))
                .foregroundStyle(Color.accentColor)
            Text(text)
                .font(.subheadline)
                .foregroundStyle(.primary)
                .fixedSize(horizontal: false, vertical: true)
            Spacer(minLength: 0)
        }
    }

    private var ctaButton: some View {
        Button(action: {}) {
            Text("Choose Pro")
                .font(.headline)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 52)
                .background(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(Color.accentColor)
                )
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    ZStack {
        Color(.systemGroupedBackground)
            .ignoresSafeArea()
        PricingCard()
            .frame(maxWidth: 380)
    }
}
