package com.eventhub.dao;

import com.eventhub.models.Registration;
import com.eventhub.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class RegistrationDAO {

    public boolean saveRegistration(Registration registration) throws SQLException {
        String query = "INSERT INTO registrations (event_id, full_name, email, phone, organization, tickets) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, registration.getEventId());
            stmt.setString(2, registration.getFullName());
            stmt.setString(3, registration.getEmail());
            stmt.setString(4, registration.getPhone());
            stmt.setString(5, registration.getOrganization());
            stmt.setInt(6, registration.getTickets());

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        }
    }
}