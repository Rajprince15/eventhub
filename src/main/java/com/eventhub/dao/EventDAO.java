package com.eventhub.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.eventhub.models.Event;
import com.eventhub.util.DatabaseConnection;

public class EventDAO {

    public List<Event> getAllEvents() throws SQLException {
        List<Event> events = new ArrayList<>();
        String query = "SELECT * FROM events ORDER BY id";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Event event = new Event();
                event.setId(rs.getString("id"));
                event.setName(rs.getString("name"));
                event.setCategory(rs.getString("category"));
                event.setDate(rs.getString("date"));
                event.setLocation(rs.getString("location"));
                event.setSeats(rs.getInt("seats"));
                event.setIcon(rs.getString("icon"));
                event.setGradient(rs.getString("gradient"));
                events.add(event);
            }
        }

        return events;
    }

    public Event getEventById(String id) throws SQLException {
        String query = "SELECT * FROM events WHERE id = ?";
        Event event = null;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    event = new Event();
                    event.setId(rs.getString("id"));
                    event.setName(rs.getString("name"));
                    event.setCategory(rs.getString("category"));
                    event.setDate(rs.getString("date"));
                    event.setLocation(rs.getString("location"));
                    event.setSeats(rs.getInt("seats"));
                    event.setIcon(rs.getString("icon"));
                    event.setGradient(rs.getString("gradient"));
                }
            }
        }

        return event;
    }

    public void updateSeats(String eventId, int newSeats) throws SQLException {
        String query = "UPDATE events SET seats = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, newSeats);
            stmt.setString(2, eventId);
            stmt.executeUpdate();
        }
    }
}