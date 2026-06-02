// Aperture DS — DSShadow
// Token-driven elevation. Reads the `shadow.sm | shadow.md | shadow.lg`
// composite tokens (offset / blur / color = `alpha.shadow`).
//
// Token gap: Tokens.swift does not yet emit shadow scalars, so the offset/blur
// values and the shadow color are encoded here from design-system.json. When the
// generator starts emitting `DS.Shadow.*` + `Color.dsShadow`, swap these locals
// for the generated members.
import SwiftUI

public enum DSShadowToken {
    case sm, md, lg
}

private struct DSShadowValues {
    let color: Color
    let radius: CGFloat   // SwiftUI blur radius ≈ CSS blur
    let x: CGFloat
    let y: CGFloat
}

private extension DSShadowToken {
    // alpha.shadow = rgba(20,24,33,0.16)
    private static let shadowColor = Color(red: 20.0 / 255.0,
                                           green: 24.0 / 255.0,
                                           blue: 33.0 / 255.0)
                                        .opacity(0.16)

    var values: DSShadowValues {
        switch self {
        case .sm: // shadow.sm — offsetY 1, blur 2
            return DSShadowValues(color: Self.shadowColor, radius: 2, x: 0, y: 1)
        case .md: // shadow.md — offsetY 6, blur 16
            return DSShadowValues(color: Self.shadowColor, radius: 16, x: 0, y: 6)
        case .lg: // shadow.lg — offsetY 16, blur 40
            return DSShadowValues(color: Self.shadowColor, radius: 40, x: 0, y: 16)
        }
    }
}

private struct DSShadowModifier: ViewModifier {
    let token: DSShadowToken

    func body(content: Content) -> some View {
        let v = token.values
        return content.shadow(color: v.color, radius: v.radius, x: v.x, y: v.y)
    }
}

public extension View {
    /// Applies a token-driven elevation shadow (`shadow.sm | .md | .lg`).
    func dsShadow(_ token: DSShadowToken) -> some View {
        modifier(DSShadowModifier(token: token))
    }
}
