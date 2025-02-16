import React, { useState } from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: #1f2731;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const AgentImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
`;

const AgentName = styled.h2`
  color: #ff4655;
  margin: 10px 0;
`;

const AgentRole = styled.div`
  color: #99a1b2;
  margin-bottom: 15px;
`;

const AbilityContainer = styled.div`
  margin-top: 15px;
`;

const AbilityTitle = styled.h3`
  color: #ff4655;
  font-size: 16px;
  margin-bottom: 5px;
`;

const AbilityDescription = styled.p`
  color: #99a1b2;
  font-size: 14px;
`;

function AgentCard({ agent }) {
  const [showAbilities, setShowAbilities] = useState(false);

  return (
    <Card onClick={() => setShowAbilities(!showAbilities)}>
      <AgentImage src={agent.fullPortrait} alt={agent.displayName} />
      <AgentName>{agent.displayName}</AgentName>
      <AgentRole>
        <img 
          src={agent.role?.displayIcon} 
          alt={agent.role?.displayName} 
          style={{ width: '20px', marginRight: '8px', verticalAlign: 'middle' }} 
        />
        {agent.role?.displayName}
      </AgentRole>
      
      {showAbilities && (
        <div>
          {agent.abilities.map((ability, index) => (
            <AbilityContainer key={index}>
              <AbilityTitle>
                <img 
                  src={ability.displayIcon} 
                  alt={ability.displayName} 
                  style={{ width: '20px', marginRight: '8px', verticalAlign: 'middle' }} 
                />
                {ability.displayName}
              </AbilityTitle>
              <AbilityDescription>{ability.description}</AbilityDescription>
            </AbilityContainer>
          ))}
        </div>
      )}
    </Card>
  );
}

export default AgentCard; 