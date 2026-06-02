// Aperture DS — DSCard
// A bounded surface modifier applying token inset, radius, fill and (for the
// elevated variant) a `shadow.md` elevation via `.dsShadow`.
//
// Usage: VStack { ... }.dsCard()            // default
//        VStack { ... }.dsCard(.elevated)   // adds shadow.md
import SwiftUI

public enum DSCardVariant {
    case `default`, elevated
}

private struct DSCardModifier: ViewModifier {
    let variant: DSCardVariant

    func body(content: Content) -> some View {
        let shaped = content
            .padding(DS.Spacing.lg)                       // card.padding
            .background(
                RoundedRectangle(cornerRadius: DS.Radius.lg, style: .continuous)
                    .fill(Color.dsBgSurface)              // card.bg
            )
            .overlay(
                RoundedRectangle(cornerRadius: DS.Radius.lg, style: .continuous)
                    .strokeBorder(Color.dsBorderDefault, lineWidth: DS.BorderWidth.thin) // card.border
            )
            .clipShape(RoundedRectangle(cornerRadius: DS.Radius.lg, style: .continuous))

        switch variant {
        case .default:
            shaped
        case .elevated:
            shaped.dsShadow(.md)                          // shadow.md
        }
    }
}

public extension View {
    /// Wraps the view in the Aperture card surface.
    func dsCard(_ variant: DSCardVariant = .default) -> some View {
        modifier(DSCardModifier(variant: variant))
    }
}
