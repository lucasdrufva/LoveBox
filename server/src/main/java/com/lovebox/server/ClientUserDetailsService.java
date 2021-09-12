package com.lovebox.server;

import com.lovebox.server.models.Client;
import com.lovebox.server.models.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientUserDetailsService implements UserDetailsService {

    @Autowired
    ClientRepository clientRepository;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        Optional<Client> maybeClient = clientRepository.findFirstByClientName(s);

        if(!maybeClient.isPresent()){
            throw new UsernameNotFoundException("No user found");
        }

        Client client = maybeClient.get();

        return User.builder().username(client.getClientName()).password(client.getPassword()).roles(client.getType()).build();
    }
}
