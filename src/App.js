import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import AgentCard from './components/AgentCard';

const AppContainer = styled.div`
  padding: 0 20px;
  background-color: #0f1923;
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AgentsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const Title = styled.h1`
  text-align: center;
  color: #ff4655;
  font-family: 'VALORANT', sans-serif;
  font-size: 3.5rem;
  margin: 0;
  padding-top: 30px;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 70, 85, 0.3);
  z-index: 1;
  text-transform: uppercase;
`;

const Subtitle = styled.h2`
  text-align: center;
  color: rgba(255, 70, 85, 0.7);
  font-family: 'VALORANT', sans-serif;
  font-size: 1.2rem;
  margin: 10px 0 20px 0;
  letter-spacing: 1px;
`;

const AgentDisplay = styled.div`
  margin-top: 10px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  width: 90%;
  max-width: 1200px;
  border: 1px solid rgba(255, 70, 85, 0.3);
  box-shadow: 0 0 30px rgba(255, 70, 85, 0.1);
  animation: fadeIn 0.5s ease-in;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AgentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
  width: 100%;
`;

const AgentImage = styled.img`
  height: 300px;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(255, 70, 85, 0.3));
`;

const AgentInfo = styled.div`
  flex: 1;
  text-align: left;
`;

const AgentName = styled.h2`
  color: #ff4655;
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-family: 'VALORANT', sans-serif;
  letter-spacing: 2px;
`;

const AgentRole = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const RoleIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const AgentDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.5;
  color: #e8e8e8;
  margin-bottom: 15px;
  max-height: 120px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 70, 85, 0.3);
    border-radius: 3px;
  }
`;

const AbilitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin-top: 30px;
`;

const AbilityCardsGrid = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: space-between;
`;

const AbilityDescriptionArea = styled.div`
  background: rgba(255, 70, 85, 0.1);
  border: 1px solid rgba(255, 70, 85, 0.4);
  border-radius: 4px;
  padding: 20px;
  min-height: 100px;
  color: white;
  opacity: ${props => props.visible ? 1 : 0};
  transition: all 0.3s ease;
  
  h3 {
    color: #ff4655;
    font-family: 'VALORANT', sans-serif;
    font-size: 1.2rem;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  p {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #e8e8e8;
  }
`;

const AbilityCard = styled.button`
  flex: 1;
  background: ${props => props.selected ? 'rgba(255, 70, 85, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  padding: 20px;
  border-radius: 4px;
  border: 1px solid ${props => props.selected ? 'rgba(255, 70, 85, 0.4)' : 'rgba(255, 70, 85, 0.2)'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  color: white;
  height: 120px;

  &:hover {
    background: rgba(255, 70, 85, 0.1);
    border-color: rgba(255, 70, 85, 0.4);
  }
`;

const AbilityIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
`;

const AbilityName = styled.h3`
  color: #ff4655;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  letter-spacing: 0.5px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
`;

const AbilityModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1f2326;
  padding: 30px;
  border-radius: 4px;
  border: 1px solid rgba(255, 70, 85, 0.3);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 90%;
  z-index: 1000;

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #e8e8e8;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

const PromptText = styled.p`
  font-style: italic;
  color: #999;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 25px;
  padding-top: 25px;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const GlobalStyle = createGlobalStyle`
  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(0.98);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0.5;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-5px);
    }
    100% {
      opacity: 0.5;
      transform: translateY(0);
    }
  }
`;

const AgentSelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  width: 90%;
  max-width: 1200px;
  margin: 20px 0;
`;

const LockIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  z-index: 3;
  opacity: 0.9;
  color: white;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

const AgentSelectCard = styled.button`
  position: relative;
  padding: 5px;
  background: ${props => props.$selected ? 'rgba(255, 70, 85, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.$selected ? '#ff4655' : 'rgba(255, 70, 85, 0.2)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  opacity: ${props => {
    if (props.$rolling || props.$hasSelectedAgent) {
      return props.$highlighted ? 1 : 0.3;
    }
    return 1;
  }};

  &:hover {
    transform: ${props => (!props.$rolling && props.$selected && !props.$hasSelectedAgent) ? 'translateY(-2px)' : 'none'};
    border-color: ${props => props.$selected ? '#ff4655' : 'rgba(255, 70, 85, 0.2)'};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => {
      if (props.$highlighted) return 'none';
      if (props.$selected) return props.$hasSelectedAgent ? 'rgba(0, 0, 0, 0.7)' : 'none';
      return 'rgba(0, 0, 0, 0.7)';
    }};
    transition: background 0.3s ease;
  }
`;

const SmallAgentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
`;

const CenterRollButton = styled.button`
  background-color: #ff4655;
  border: 2px solid #ff4655;
  color: white;
  padding: 20px 60px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: 'VALORANT', sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 20px;

  &:hover {
    background-color: transparent;
    color: #ff4655;
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 70, 85, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SelectAllButton = styled(AgentSelectCard)`
  background: rgba(255, 70, 85, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'VALORANT', sans-serif;
  font-size: 0.9rem;
  color: #ff4655;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &::before {
    background: none;
  }
`;

const ReRollButton = styled(CenterRollButton)`
  margin-top: 30px;
`;

// Add a new styled component for the highlighted agent card
const HighlightedAgentCard = styled(AgentSelectCard)`
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(255, 70, 85, 0.4);
  border: 2px solid #ff4655;
  background: rgba(255, 70, 85, 0.15);
  z-index: 2;

  &::before {
    background: none;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

// Add these new styled components
const ShowDetailsButton = styled.button`
  background: transparent;
  border: 2px solid #ff4655;
  color: #ff4655;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-family: 'VALORANT', sans-serif;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background: rgba(255, 70, 85, 0.1);
    transform: translateY(-2px);
  }
`;

const DetailsModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1f2326;
  padding: 30px;
  border-radius: 4px;
  border: 1px solid rgba(255, 70, 85, 0.3);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  max-width: 1000px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1000;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 70, 85, 0.3);
    border-radius: 3px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
`;

// Add this new SVG icon component for passive abilities
const PassiveIcon = styled.div`
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  color: white;
  opacity: 0.9;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const agents = [
  {
    name: "Detective",
    description: "A sharp-witted investigator who excels at solving mysteries",
    prompt: "You are a detective who speaks in a noir style and loves solving mysteries."
  },
  {
    name: "Chef",
    description: "A passionate culinary expert who loves discussing food",
    prompt: "You are a professional chef with 20 years of experience who is passionate about cooking."
  },
  {
    name: "Historian",
    description: "A knowledgeable scholar specializing in historical events",
    prompt: "You are a history professor who specializes in world history and loves sharing interesting historical facts."
  },
  {
    name: "Poet",
    description: "A creative writer who communicates in verse",
    prompt: "You are a romantic poet who prefers to communicate in rhyming verse."
  },
  {
    name: "Scientist",
    description: "An analytical thinker focused on scientific explanations",
    prompt: "You are a scientist who loves explaining complex concepts in simple terms."
  }
];

function App() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [enabledAgents, setEnabledAgents] = useState(new Set());
  const [showDetails, setShowDetails] = useState(false);
  const initCount = useRef(0);

  useEffect(() => {
    if (initCount.current === 0) {
      console.log("(c) 2025 KYMA_CAT");
    }
    initCount.current += 1;

    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
      .then(response => response.json())
      .then(data => {
        setAgents(data.data);
        // Initially all agents are unselected
        setEnabledAgents(new Set());
      });
  }, []);

  const toggleAgent = (agentUuid) => {
    setEnabledAgents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(agentUuid)) {
        newSet.delete(agentUuid);
      } else {
        newSet.add(agentUuid);
      }
      return newSet;
    });
  };

  const toggleAllAgents = () => {
    if (enabledAgents.size === agents.length) {
      // If all are selected, deselect all
      setEnabledAgents(new Set());
    } else {
      // Otherwise, select all
      setEnabledAgents(new Set(agents.map(agent => agent.uuid)));
    }
  };

  const rollAgent = () => {
    if (isRolling || enabledAgents.size === 0) return;
    
    setIsRolling(true);
    setSelectedAbility(null);
    
    let duration = 2000;
    let intervals = [80, 120, 200, 300, 500];
    let startTime = Date.now();

    const enabledAgentsList = agents.filter(agent => enabledAgents.has(agent.uuid));

    const roll = () => {
      const elapsed = Date.now() - startTime;
      const randomIndex = Math.floor(Math.random() * enabledAgentsList.length);
      setSelectedAgent(enabledAgentsList[randomIndex]);

      if (elapsed < duration) {
        const intervalIndex = Math.min(
          Math.floor((elapsed / duration) * intervals.length),
          intervals.length - 1
        );
        setTimeout(roll, intervals[intervalIndex]);
      } else {
        const finalIndex = Math.floor(Math.random() * enabledAgentsList.length);
        setSelectedAgent(enabledAgentsList[finalIndex]);
        setIsRolling(false);
      }
    };

    roll();
  };

  // Sort agents alphabetically
  const sortedAgents = [...agents].sort((a, b) => 
    a.displayName.localeCompare(b.displayName)
  );

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Title>AGENT ROULETTE</Title>
        {!selectedAgent && (
          <Subtitle>SELECT AGENTS</Subtitle>
        )}
        
        <AgentSelectionGrid>
          {sortedAgents.map(agent => {
            const isSelected = enabledAgents.has(agent.uuid);
            const isHighlighted = selectedAgent && selectedAgent.uuid === agent.uuid;
            
            const CardComponent = isHighlighted ? HighlightedAgentCard : AgentSelectCard;
            
            return (
              <CardComponent
                key={agent.uuid}
                $selected={isSelected}
                $rolling={isRolling}
                $highlighted={isHighlighted}
                $hasSelectedAgent={!!selectedAgent}
                onClick={() => !isRolling && toggleAgent(agent.uuid)}
                style={{
                  animation: isRolling && isHighlighted ? 'pulse 0.3s ease-in-out infinite' : 'none'
                }}
              >
                <SmallAgentImage 
                  src={agent.displayIcon} 
                  alt={agent.displayName} 
                />
                {!isSelected && (
                  <LockIcon>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1C8.676 1 6 3.676 6 7v3H4v12h16V10h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v3H8V7c0-2.276 1.724-4 4-4z"/>
                    </svg>
                  </LockIcon>
                )}
              </CardComponent>
            );
          })}
          <SelectAllButton 
            onClick={toggleAllAgents}
            $selected={enabledAgents.size === agents.length}
          >
            {enabledAgents.size === agents.length ? 'DESELECT ALL' : 'SELECT ALL'}
          </SelectAllButton>
        </AgentSelectionGrid>

        {enabledAgents.size >= 2 && !isRolling && (
          <CenterRollButton 
            onClick={rollAgent} 
            disabled={isRolling}
          >
            {isRolling ? 'ROLLING...' : selectedAgent ? 'RE-ROLL' : 'ROLL'}
          </CenterRollButton>
        )}

        {selectedAgent && !isRolling && (
          <ShowDetailsButton onClick={() => {
            setShowDetails(true);
            setSelectedAbility(null);
          }}>
            SHOW AGENT DETAILS
          </ShowDetailsButton>
        )}

        {showDetails && selectedAgent && (
          <>
            <ModalOverlay onClick={() => setShowDetails(false)} />
            <DetailsModal>
              <AgentHeader>
                <AgentImage 
                  src={selectedAgent.fullPortrait || selectedAgent.displayIcon} 
                  alt={selectedAgent.displayName}
                />
                <AgentInfo>
                  <AgentName>{selectedAgent.displayName}</AgentName>
                  <AgentRole>
                    <RoleIcon src={selectedAgent.role?.displayIcon} alt={selectedAgent.role?.displayName} />
                    <span>{selectedAgent.role?.displayName}</span>
                  </AgentRole>
                  <AgentDescription>{selectedAgent.description}</AgentDescription>
                </AgentInfo>
              </AgentHeader>

              <AbilitiesContainer>
                <AbilityCardsGrid>
                  {selectedAgent.abilities.map((ability, index) => (
                    <AbilityCard 
                      key={index}
                      onClick={() => setSelectedAbility(ability === selectedAbility ? null : ability)}
                      selected={selectedAbility === ability}
                    >
                      {ability.displayIcon ? (
                        <AbilityIcon src={ability.displayIcon} alt={ability.displayName} />
                      ) : (
                        <PassiveIcon>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm1 3v3.5l3.5 2-1 1.73-4.5-2.73V7h2z" 
                              fill="currentColor"
                            />
                          </svg>
                        </PassiveIcon>
                      )}
                      <AbilityName>{ability.displayName}</AbilityName>
                    </AbilityCard>
                  ))}
                </AbilityCardsGrid>
                
                <AbilityDescriptionArea visible={!!selectedAbility}>
                  {selectedAbility && (
                    <>
                      <h3>{selectedAbility.displayName}</h3>
                      <p>{selectedAbility.description}</p>
                    </>
                  )}
                </AbilityDescriptionArea>
              </AbilitiesContainer>
            </DetailsModal>
          </>
        )}
      </AppContainer>
    </>
  );
}

export default App; 