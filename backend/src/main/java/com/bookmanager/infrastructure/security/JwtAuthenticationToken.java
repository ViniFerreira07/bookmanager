package com.bookmanager.infrastructure.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.UUID;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    private final String email;
    private final UUID userId;

    public JwtAuthenticationToken(String email, String role, UUID userId) {
        super(List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        this.email = email;
        this.userId = userId;
        setAuthenticated(true);
    }

    public UUID getUserId() {
        return userId;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return email;
    }
}
