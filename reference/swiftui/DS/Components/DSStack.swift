// Aperture DS — DSStack
// VStack/HStack wrapper whose spacing MUST be a DS.Spacing token.
// The gap is expressed as a GapToken enum, never a raw CGFloat, so spacing
// cannot drift off the scale.
//
// Usage: DSStack(.vertical, gap: .md) { ... }
import SwiftUI

/// A layout primitive that wraps VStack/HStack with a token-driven gap.
public struct DSStack<Content: View>: View {
    public enum Axis {
        case horizontal, vertical
    }

    /// Spacing token gap. Maps 1:1 onto `DS.Spacing.*`.
    public enum GapToken {
        case none, xs, sm, md, lg, xl

        var value: CGFloat {
            switch self {
            case .none: return DS.Spacing.none
            case .xs:   return DS.Spacing.xs
            case .sm:   return DS.Spacing.sm
            case .md:   return DS.Spacing.md
            case .lg:   return DS.Spacing.lg
            case .xl:   return DS.Spacing.xl
            }
        }
    }

    private let axis: Axis
    private let gap: GapToken
    private let alignment: Alignment
    private let content: Content

    public init(
        _ axis: Axis,
        gap: GapToken = .md,
        alignment: Alignment = .center,
        @ViewBuilder content: () -> Content
    ) {
        self.axis = axis
        self.gap = gap
        self.alignment = alignment
        self.content = content()
    }

    public var body: some View {
        switch axis {
        case .horizontal:
            HStack(alignment: alignment.vertical, spacing: gap.value) {
                content
            }
        case .vertical:
            VStack(alignment: alignment.horizontal, spacing: gap.value) {
                content
            }
        }
    }
}
